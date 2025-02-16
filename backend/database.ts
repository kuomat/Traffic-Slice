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
	limit?: number // used for pagination
	cursor?: number // used for pagination
	orderBy?: keyof Alert
	order?: "asc" | "desc"
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
			limit = this.MAX_ALERTS,
			cursor = 0,
			orderBy = "severity",
			order = "desc"
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

		if (whereClauses.length > 0) {
			query += ` WHERE ${whereClauses.join(" AND ")}`
		}

		// Sort by whatever's given then timestamp
		query += ` ORDER BY ${orderBy} ${order}, timestamp DESC LIMIT ? OFFSET ?`
		params.push(limit, cursor)

		return { query, params }
	}

	// Alert queries
	async getAlerts(filter: AlertFilter = {}): Promise<Alert[]> {
		const { query, params } = await this.buildQuery(filter)
		return new Promise((resolve, reject) => {
			this.db!.all(query, params, (err, rows) => {
				if (err) reject(err)
				resolve(rows as Alert[])
			})
		})
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
