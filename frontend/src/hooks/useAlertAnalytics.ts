import { useQuery } from "@tanstack/react-query"
import { AlertFilter } from "@/types/alerts"

export type TimeGroupBy = "day" | "month" | "hour"
export type DimensionGroupBy =
	| "application"
	| "type"
	| "severity"
	| "alert_name"
	| "destination"
	| "none"

export type AnalyticsFilter = AlertFilter & {
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

const fetchAlertAnalytics = async (filter: AnalyticsFilter): Promise<AnalyticsDataPoint[]> => {
	const params = new URLSearchParams()

	Object.entries(filter).forEach(([key, value]) => {
		if (value !== undefined) {
			params.append(key, value.toString())
		}
	})

	const query = params.toString() ? `?${params.toString()}` : ""
	const url = `${process.env.API_ENDPOINT}/api/analytics/alerts${query}`

	try {
		const response = await fetch(url)

		if (!response.ok) {
			throw new Error("Failed to fetch alert analytics")
		}

		const data = await response.json()

		return data
	} catch (error) {
		console.error("Fetch error:", error)
		throw error
	}
}

export const useAlertAnalytics = (filter: AnalyticsFilter) => {
	return useQuery({
		queryKey: ["alertAnalytics", filter],
		queryFn: () => fetchAlertAnalytics(filter),
		retry: 1,
		staleTime: 60000, // 1 minute
		placeholderData: [], // Provide empty array as placeholder when no data is available
		refetchOnWindowFocus: false // Disable refetching on window focus to reduce unnecessary requests
	})
}
