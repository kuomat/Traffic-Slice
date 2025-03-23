import { useAlerts } from "./useAlerts"
import { AlertFilter } from "@/types/alerts"

/**
 * Hook that checks if there are any notable alerts (severity >= 4)
 * Leverages the existing useAlerts hook for optimal caching
 */
export const useNotableAlerts = () => {
	// Create a filter specifically for notable alerts (severity 4-5)
	const filter: AlertFilter = {
		minSeverity: 4,
		orderBy: "severity",
		order: "desc",
		pageSize: 1 // We only need to know if at least one exists
	}

	// Use the existing alerts hook
	const { data: alerts, isLoading, error } = useAlerts(filter, false)

	// Derive a value that indicates if notable alerts exist
	const hasNotableAlerts = !isLoading && !error && alerts && alerts.length > 0

	return {
		hasNotableAlerts,
		notableAlerts: alerts || [],
		isLoading,
		error
	}
}
