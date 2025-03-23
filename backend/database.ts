import sqlite3 from "sqlite3"
import path from "path"

export type Alert = {
	alert_name: string
	message: string
	application_from: string
	destination_domain: string
	type: string
	severity: number
	timestamp: string
}

/**
 * A json abstract over a sql query.
 *
 * This is used to filter the alerts.
 *
 * String fields represent a LIKE clause
 */
export type AlertFilter = {
	alert_name?: string
	application_from?: string
	destination_domain?: string
	type?: string
	severity?: number
	minSeverity?: number // Minimum severity threshold
	minTimestamp?: string // Minimum timestamp (for date filtering)
	limit?: number // used for pagination
	cursor?: number // used for pagination
	orderBy?: keyof Alert
	order?: "asc" | "desc"
	offset?: number // Pagination offset
	pageSize?: number // Number of items per page
}

// Primary time grouping options
export type TimeGroupBy = "day" | "month" | "hour"

// Secondary dimension grouping options
export type DimensionGroupBy =
	| "application"
	| "type"
	| "severity"
	| "alert_name"
	| "destination"
	| "none"

export type AnalyticsFilter = Omit<
	AlertFilter,
	"orderBy" | "order" | "limit" | "cursor" | "offset" | "pageSize"
> & {
	timeGroupBy: TimeGroupBy
	dimensionGroupBy: DimensionGroupBy
	startDate?: string
	endDate?: string
}

export type AnalyticsDataPoint = {
	count: number
	time_key: string
	dimension_key: string | null
}

class DatabaseService {
	private db: sqlite3.Database | null = null

	private MAX_ALERTS = 100

	constructor() {
		this.initialize()
	}

	async initialize() {
		if (!this.db) {
			const dbPath = path.join(__dirname, process.env.DATABASE_PATH!)
			this.db = new sqlite3.Database(dbPath)
		}
	}

	async buildQuery(filter: AlertFilter): Promise<{ query: string; params: any[] }> {
		const {
			alert_name,
			application_from,
			destination_domain,
			type,
			severity,
			minSeverity,
			minTimestamp,
			limit = this.MAX_ALERTS,
			cursor = 0,
			orderBy = "severity",
			order = "desc",
			offset,
			pageSize
		} = filter

		let query = `SELECT * FROM alerts`

		const whereClauses: string[] = []
		const params: any[] = []

		if (alert_name) {
			whereClauses.push(`alert_name LIKE ?`)
			params.push(`%${alert_name}%`)
		}

		if (application_from) {
			whereClauses.push(`application_from LIKE ?`)
			params.push(`%${application_from}%`)
		}

		if (destination_domain) {
			whereClauses.push(`destination_domain LIKE ?`)
			params.push(`%${destination_domain}%`)
		}

		if (type) {
			whereClauses.push(`type LIKE ?`)
			params.push(`%${type}%`)
		}

		if (severity) {
			whereClauses.push(`severity = ?`)
			params.push(severity)
		}

		// Add filter for minimum severity (notable alerts)
		if (minSeverity) {
			whereClauses.push(`severity >= ?`)
			params.push(minSeverity)
		}

		// Add filter for minimum timestamp (notable alerts)
		if (minTimestamp) {
			whereClauses.push(`timestamp >= ?`)
			params.push(minTimestamp)
		}

		if (whereClauses.length > 0) {
			query += ` WHERE ${whereClauses.join(" AND ")}`
		}

		// Sort by whatever's given then timestamp
		query += ` ORDER BY ${orderBy} ${order}, timestamp DESC`

		return { query, params }
	}

	// Alert queries
	async getAlerts(filter: AlertFilter = {}): Promise<Alert[]> {
		// Ensure all required filter fields have default values
		const finalFilter = {
			...filter,
			offset: filter.offset !== undefined ? filter.offset : 0,
			pageSize: filter.pageSize !== undefined ? filter.pageSize : this.MAX_ALERTS
		}

		const { query, params } = await this.buildQuery(finalFilter)

		// Directly interpolate LIMIT and OFFSET into the query string
		const paginatedQuery = `${query} LIMIT ${finalFilter.pageSize} OFFSET ${finalFilter.offset}`
		return new Promise((resolve, reject) => {
			this.db!.all(paginatedQuery, params, (err, rows) => {
				if (err) reject(err)
				resolve(rows as Alert[])
			})
		})
	}

	async getAlertAnalytics(filter: AnalyticsFilter): Promise<AnalyticsDataPoint[]> {
		const {
			alert_name,
			application_from,
			destination_domain,
			type,
			severity,
			minSeverity,
			minTimestamp,
			timeGroupBy,
			dimensionGroupBy,
			startDate,
			endDate
		} = filter

		// Determine the group by expression
		let groupByExpr: string
		let selectExpr: string

		// Handle time-based grouping
		let timeGroupExpr = ""
		let timeSelectExpr = ""

		switch (timeGroupBy) {
			case "month":
				timeGroupExpr = "strftime('%Y-%m', timestamp)"
				timeSelectExpr = "strftime('%Y-%m', timestamp)"
				break
			case "hour":
				timeGroupExpr = "strftime('%Y-%m-%d %H:00', timestamp)"
				timeSelectExpr = "strftime('%Y-%m-%d %H:00', timestamp)"
				break
			case "day":
				timeGroupExpr = "strftime('%Y-%m-%d', timestamp)"
				timeSelectExpr = "strftime('%Y-%m-%d', timestamp)"
				break
			default:
				// Not a time-based group
				break
		}

		// Handle dimension-based grouping
		let dimensionGroupExpr = ""
		let dimensionSelectExpr = ""

		switch (dimensionGroupBy) {
			case "application":
				dimensionGroupExpr = "application_from"
				dimensionSelectExpr = "application_from"
				break
			case "type":
				dimensionGroupExpr = "type"
				dimensionSelectExpr = "type"
				break
			case "severity":
				dimensionGroupExpr = "severity"
				dimensionSelectExpr = "cast(severity as text)"
				break
			case "alert_name":
				dimensionGroupExpr = "alert_name"
				dimensionSelectExpr = "alert_name"
				break
			case "destination":
				dimensionGroupExpr = "destination_domain"
				dimensionSelectExpr = "destination_domain"
				break
			case "none":
				dimensionGroupExpr = "'all'" // Use a constant value for grouping
				dimensionSelectExpr = "NULL" // Return NULL as the dimension key
				break
		}

		// Compose the final GROUP BY and SELECT expressions
		if (dimensionGroupBy && dimensionGroupBy !== "none") {
			// Composite grouping (time + dimension)
			groupByExpr = `${timeGroupExpr}, ${dimensionGroupExpr}`
			selectExpr = `${timeSelectExpr} as time_key, ${dimensionSelectExpr} as dimension_key`
		} else {
			// Time-only grouping
			groupByExpr = timeGroupExpr
			selectExpr = `${timeSelectExpr} as time_key, NULL as dimension_key`
		}

		// For a count query to get the total regardless of grouping
		let totalQuery = "SELECT COUNT(*) as count FROM alerts"
		const totalWhereClauses: string[] = []
		const totalParams: any[] = []

		// Build the query
		let query = `SELECT ${selectExpr}, COUNT(*) as count FROM alerts`
		const whereClauses: string[] = []
		const params: any[] = []

		if (alert_name) {
			whereClauses.push(`alert_name LIKE ?`)
			params.push(`%${alert_name}%`)
			totalWhereClauses.push(`alert_name LIKE ?`)
			totalParams.push(`%${alert_name}%`)
		}

		if (application_from) {
			whereClauses.push(`application_from LIKE ?`)
			params.push(`%${application_from}%`)
			totalWhereClauses.push(`application_from LIKE ?`)
			totalParams.push(`%${application_from}%`)
		}

		if (destination_domain) {
			whereClauses.push(`destination_domain LIKE ?`)
			params.push(`%${destination_domain}%`)
			totalWhereClauses.push(`destination_domain LIKE ?`)
			totalParams.push(`%${destination_domain}%`)
		}

		if (type) {
			whereClauses.push(`type LIKE ?`)
			params.push(`%${type}%`)
			totalWhereClauses.push(`type LIKE ?`)
			totalParams.push(`%${type}%`)
		}

		if (severity) {
			whereClauses.push(`severity = ?`)
			params.push(severity)
			totalWhereClauses.push(`severity = ?`)
			totalParams.push(severity)
		}

		// Add filter for minimum severity
		if (minSeverity) {
			whereClauses.push(`severity >= ?`)
			params.push(minSeverity)
			totalWhereClauses.push(`severity >= ?`)
			totalParams.push(minSeverity)
		}

		// Add filter for minimum timestamp
		if (minTimestamp) {
			whereClauses.push(`timestamp >= ?`)
			params.push(minTimestamp)
			totalWhereClauses.push(`timestamp >= ?`)
			totalParams.push(minTimestamp)
		}

		// Add date range filters if provided
		if (startDate) {
			whereClauses.push(`timestamp >= ?`)
			params.push(startDate)
			totalWhereClauses.push(`timestamp >= ?`)
			totalParams.push(startDate)
		}

		if (endDate) {
			whereClauses.push(`timestamp <= ?`)
			params.push(endDate)
			totalWhereClauses.push(`timestamp <= ?`)
			totalParams.push(endDate)
		}

		if (whereClauses.length > 0) {
			query += ` WHERE ${whereClauses.join(" AND ")}`
			if (totalWhereClauses.length > 0) {
				totalQuery += ` WHERE ${totalWhereClauses.join(" AND ")}`
			}
		}

		// Group by the selected dimension
		query += ` GROUP BY ${groupByExpr}`

		// Order appropriately based on groupBy
		if (dimensionGroupBy && dimensionGroupBy !== "none") {
			// For composite groupings: order by time first, then by count within each time period
			query += ` ORDER BY time_key ASC, count DESC`
		} else if (timeGroupBy === "day" || timeGroupBy === "month" || timeGroupBy === "hour") {
			// Single time-based grouping
			query += ` ORDER BY time_key ASC`
		} else if (timeGroupBy === "severity") {
			// Severity-only grouping
			query += ` ORDER BY dimension_key DESC`
		} else {
			// Other dimension-only groupings
			query += ` ORDER BY count DESC`
		}

		// If this is a request for total alerts by any time dimension without other filters, include the total count
		const isTimeDimensionOnly =
			(timeGroupBy === "day" || timeGroupBy === "month" || timeGroupBy === "hour") &&
			(dimensionGroupBy === "none" || !dimensionGroupBy) &&
			!application_from &&
			!destination_domain &&
			!type &&
			!severity

		if (isTimeDimensionOnly) {
			return new Promise((resolve, reject) => {
				let results: AnalyticsDataPoint[] = []

				// First get the total
				this.db!.get(totalQuery, totalParams, (totalErr, totalRow: { count: number }) => {
					if (totalErr) {
						console.error("Database error getting total:", totalErr)
						reject(totalErr)
						return
					}

					// Then get the grouped data
					this.db!.all(query, params, (err, rows) => {
						if (err) {
							console.error("Database error:", err)
							reject(err)
							return
						}

						// If we don't have any grouped data but we have a total,
						// add a default entry for today with the total count
						if (rows.length === 0 && totalRow && totalRow.count > 0) {
							const today = new Date().toISOString().split("T")[0]
							results.push({
								time_key: today,
								dimension_key: null,
								count: totalRow.count
							})
						} else {
							results = rows as AnalyticsDataPoint[]
						}

						resolve(results)
					})
				})
			})
		} else {
			// Regular query without total count addition
			return new Promise((resolve, reject) => {
				this.db!.all(query, params, (err, rows) => {
					if (err) {
						console.error("Database error:", err)
						reject(err)
					}
					resolve(rows as AnalyticsDataPoint[])
				})
			})
		}
	}

	async listApplications(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.db!.all(
				"SELECT DISTINCT application_from FROM alerts",
				(err, rows: { application_from: string }[]) => {
					if (err) reject(err)
					resolve(rows.map(row => row.application_from))
				}
			)
		})
	}

	async listDestinations(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.db!.all(
				"SELECT DISTINCT destination_domain FROM alerts",
				(err, rows: { destination_domain: string }[]) => {
					if (err) reject(err)
					resolve(rows.map(row => row.destination_domain))
				}
			)
		})
	}

	async listAlertTypes(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.db!.all("SELECT DISTINCT type FROM alerts", (err, rows: { type: string }[]) => {
				if (err) reject(err)
				resolve(rows.map(row => row.type))
			})
		})
	}

	// Get total count of alerts in the database
	async getTotalAlertCount(): Promise<number> {
		return new Promise((resolve, reject) => {
			this.db!.get("SELECT COUNT(*) as count FROM alerts", (err, row: { count: number }) => {
				if (err) reject(err)
				resolve(row.count)
			})
		})
	}

	// Utility method to close the database connection
	async close() {
		if (this.db) {
			await this.db.close()
			this.db = null
		}
	}
}

// Export a singleton instance
export const dbService = new DatabaseService()
