import { useQuery } from "@tanstack/react-query"
import { Alert, AlertFilter } from "@/types/alerts"

const fetchAlerts = async (filter?: AlertFilter): Promise<Alert[]> => {
	const params = new URLSearchParams()
	if (filter) {
		Object.entries(filter).forEach(([key, value]) => {
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

export const useAlerts = (filter?: AlertFilter) => {
	return useQuery({
		queryKey: ["alerts", filter],
		queryFn: () => fetchAlerts(filter),
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
