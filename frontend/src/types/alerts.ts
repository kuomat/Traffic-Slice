export type Alert = {
	alert_name: string
	message: string
	application_from: string
	destination_domain: string
	type: string
	severity: number
	timestamp: string
}

export type SearchableAlertProperty =
	| "alert_name"
	| "message"
	| "application_from"
	| "destination_domain"
	| "type"
	| "severity"

/**
 * A json abstract over a sql query.
 *
 * This is used to filter the alerts.
 *
 * String fields represent a LIKE clause
 */
export type AlertFilter = {
	alert_name?: string
	message?: string
	application_from?: string
	destination_domain?: string
	type?: string
	severity?: number
	limit?: number
	cursor?: number
	orderBy?: keyof Alert
	order?: "asc" | "desc"
	offset?: number
	pageSize?: number
}
