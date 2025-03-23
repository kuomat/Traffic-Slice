import React, { useMemo } from "react"
import {
	useAlertAnalytics,
	TimeGroupBy,
	DimensionGroupBy,
	AnalyticsFilter
} from "@/hooks/useAlertAnalytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ActivitySquare, BarChart2, Zap } from "lucide-react"
import { subDays } from "date-fns"

type AlertMetricCardsProps = {
	startDate?: Date
	endDate?: Date
}

const AlertMetricCards: React.FC<AlertMetricCardsProps> = (props: AlertMetricCardsProps) => {
	const startDate = useMemo(() => props.startDate || subDays(new Date(), 30), [props.startDate])
	const endDate = useMemo(() => props.endDate || new Date(), [props.endDate])

	// Get total alert count for the last month
	const totalFilter: AnalyticsFilter = {
		timeGroupBy: "month" satisfies TimeGroupBy,
		dimensionGroupBy: "none" satisfies DimensionGroupBy,
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString()
	}

	// Get high severity alert count for the last month (severity >= 4)
	const severityFilter: AnalyticsFilter = {
		timeGroupBy: "month",
		dimensionGroupBy: "none",
		minSeverity: 4,
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString()
	}

	const typeFilter: AnalyticsFilter = {
		timeGroupBy: "month",
		dimensionGroupBy: "type",
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString()
	}

	const applicationFilter: AnalyticsFilter = {
		timeGroupBy: "month",
		dimensionGroupBy: "application",
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString()
	}

	const { data: alertsData, isLoading: isLoadingAlerts } = useAlertAnalytics(totalFilter)
	const { data: severityData, isLoading: isLoadingSeverity } = useAlertAnalytics(severityFilter)
	const { data: typeData, isLoading: isLoadingType } = useAlertAnalytics(typeFilter)
	const { data: applicationData, isLoading: isLoadingApplication } =
		useAlertAnalytics(applicationFilter)

	// Calculate total alert count
	const totalAlerts = useMemo(() => {
		if (!alertsData) return 0
		return alertsData.reduce((sum, item) => sum + item.count, 0)
	}, [alertsData])

	// Calculate high severity alert count (severity >= 4)
	const highSeverityAlerts = useMemo(() => {
		if (!severityData) return 0
		return severityData.reduce((sum, item) => sum + item.count, 0)
	}, [severityData])

	// Get unique alert types count
	const uniqueTypes = useMemo(() => {
		if (!typeData) return 0
		return typeData.length
	}, [typeData])

	// Get unique applications count
	const uniqueApplications = useMemo(() => {
		if (!applicationData) return 0
		return applicationData.length
	}, [applicationData])

	// Helper to determine what to render for each metric
	const renderMetric = (isLoading: boolean, value: number) => {
		// If we have a value, show it regardless of loading state
		if (value > 0) {
			return value
		}

		// If still loading, show loading indicator
		if (isLoading) {
			return "..."
		}

		// If not loading and value is 0, show 0
		return 0
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
					<AlertTriangle className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{renderMetric(isLoadingAlerts, totalAlerts)}
					</div>
					<p className="text-xs text-muted-foreground">Last 30 days</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">High Severity</CardTitle>
					<Zap className="h-4 w-4 text-orange-500" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{renderMetric(isLoadingSeverity, highSeverityAlerts)}
					</div>
					<p className="text-xs text-muted-foreground">Severity 4-5 alerts</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Alert Types</CardTitle>
					<BarChart2 className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{renderMetric(isLoadingType, uniqueTypes)}
					</div>
					<p className="text-xs text-muted-foreground">Unique alert categories</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Applications</CardTitle>
					<ActivitySquare className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{renderMetric(isLoadingApplication, uniqueApplications)}
					</div>
					<p className="text-xs text-muted-foreground">Affected applications</p>
				</CardContent>
			</Card>
		</div>
	)
}

export default AlertMetricCards
