import { z } from "zod"

export type Alert = {
	alert_name: string
	message: string
	application_from: string
	destination_domain: string
	type: string
	severity: number
	timestamp: string
}

export const AlertFilterSchema = z.object({
	alert_name: z.string().optional(),
	message: z.string().optional(),
	application_from: z.string().optional(),
	destination_domain: z.string().optional(),
	type: z.string().optional(),
	severity: z.union([z.string().transform(val => parseInt(val, 10)), z.number()]).optional(),
	minSeverity: z.union([z.string().transform(val => parseInt(val, 10)), z.number()]).optional(), // Minimum severity threshold for notable alerts
	minTimestamp: z.string().optional(), // Minimum timestamp for date filtering (notable alerts)
	limit: z.number().optional(), // used for pagination
	cursor: z.number().optional(), // used for pagination
	orderBy: z
		.enum([
			"alert_name",
			"message",
			"application_from",
			"destination_domain",
			"type",
			"severity",
			"timestamp"
		])
		.optional(),
	order: z.enum(["asc", "desc"]).optional(),
	offset: z.union([z.string().transform(val => parseInt(val, 10)), z.number()]).optional(), // Pagination offset
	pageSize: z.union([z.string().transform(val => parseInt(val, 10)), z.number()]).optional() // Number of items per page
})

export type AlertFilter = z.infer<typeof AlertFilterSchema>

export const AnalyticsFilterSchema = z.object({
	alert_name: z.string().optional(),
	application_from: z.string().optional(),
	destination_domain: z.string().optional(),
	type: z.string().optional(),
	severity: z.union([z.string().transform(val => parseInt(val, 10)), z.number()]).optional(),
	minSeverity: z.union([z.string().transform(val => parseInt(val, 10)), z.number()]).optional(),
	minTimestamp: z.string().optional(),
	timeGroupBy: z.enum(["day", "month", "hour"]),
	dimensionGroupBy: z.enum([
		"application",
		"type",
		"severity",
		"alert_name",
		"destination",
		"none"
	]),
	startDate: z.string().optional(),
	endDate: z.string().optional()
})

export type AnalyticsFilter = z.infer<typeof AnalyticsFilterSchema>
