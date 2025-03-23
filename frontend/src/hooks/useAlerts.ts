import { useQuery } from "@tanstack/react-query"
import { Alert, AlertFilter } from "@/types/alerts"

const fetchAlerts = async (filter?: AlertFilter, notableAlertsOnly?: boolean): Promise<Alert[]> => {
	const params = new URLSearchParams()

	// Create a copy of the filter to avoid mutating the original
	const updatedFilter = { ...filter }

	// Apply notable alerts filter (severity > 3 and last 3 days)
	if (notableAlertsOnly) {
		// Set minimum severity threshold to 4
		updatedFilter.minSeverity = 4

		// Calculate timestamp for 3 days ago
		const threeDaysAgo = new Date()
		threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
		updatedFilter.minTimestamp = threeDaysAgo.toISOString()
	}

	if (updatedFilter) {
		Object.entries(updatedFilter).forEach(([key, value]) => {
			if (value !== undefined) {
				params.append(key, value.toString())
			}
		})
	}
	const query = params.toString() ? `?${params.toString()}` : ""
	const response = await fetch(`${process.env.API_ENDPOINT}/api/alerts${query}`)
	if (!response.ok) throw new Error("Failed to fetch alerts")

	return response.json()
}

const fetchApplications = async (): Promise<string[]> => {
	const response = await fetch(`${process.env.API_ENDPOINT}/api/applications`)
	if (!response.ok) throw new Error("Failed to fetch applications")
	return response.json()
}

const fetchDestinations = async (): Promise<string[]> => {
	const response = await fetch(`${process.env.API_ENDPOINT}/api/destinations`)
	if (!response.ok) throw new Error("Failed to fetch destinations")
	return response.json()
}

const fetchAlertTypes = async (): Promise<string[]> => {
	const response = await fetch(`${process.env.API_ENDPOINT}/api/alert-types`)
	if (!response.ok) throw new Error("Failed to fetch alert types")
	return response.json()
}

export const useAlerts = (filter?: AlertFilter, notableAlertsOnly?: boolean) => {
	return useQuery({
		queryKey: ["alerts", filter, notableAlertsOnly],
		queryFn: () => fetchAlerts(filter, notableAlertsOnly),
		enabled: !!filter
	})
}

export const useApplications = () => {
	return useQuery({
		queryKey: ["applications"],
		queryFn: fetchApplications
	})
}

export const useDestinations = () => {
	return useQuery({
		queryKey: ["destinations"],
		queryFn: fetchDestinations
	})
}

export const useAlertTypes = () => {
	return useQuery({
		queryKey: ["alertTypes"],
		queryFn: fetchAlertTypes
	})
}
