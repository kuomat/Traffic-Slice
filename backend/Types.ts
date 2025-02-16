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
	severity: z.number().optional(),
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
	order: z.enum(["asc", "desc"]).optional()
})

export type AlertFilter = z.infer<typeof AlertFilterSchema>
