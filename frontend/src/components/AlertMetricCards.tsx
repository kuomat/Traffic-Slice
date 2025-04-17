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

import { Skeleton } from "@/components/ui/skeleton"
import { RollingCounter } from "@/components/ui/RollingCounter"

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

	const renderMetric = (isLoading: boolean, value: number, index = 0) => {
		// If we have a value, show it regardless of loading state

		if (value > 0) {
			return (
				<RollingCounter
					endValue={value}
					className="text-2xl font-bold"
					duration={1500}
					delay={index * 200}
					digitHeight={36}
					fontSize={24}
					highlightColor="text-primary"
				/>
			)
		}

		// If still loading, show loading indicator

		if (isLoading) {
			return <Skeleton className="h-8 w-16" />
		}

		// If not loading and value is 0, show 0

		return <span className="text-2xl font-bold">0</span>
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card className="transition-all hover:shadow-md overflow-hidden border rounded-lg bg-card shadow hover:translate-y-[-2px] duration-300">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Alerts</CardTitle>

					<AlertTriangle className="h-4 w-4 text-muted-foreground" />
				</CardHeader>

				<CardContent>
					{renderMetric(isLoadingAlerts, totalAlerts, 0)}

					<p className="text-xs text-muted-foreground">Last 30 days</p>
				</CardContent>

				{isLoadingAlerts && (
					<div className="h-1 bg-blue-500/20 relative">
						<div className="absolute inset-0 h-1 bg-blue-500 animate-progress-bar"></div>
					</div>
				)}
			</Card>

			<Card className="transition-all hover:shadow-md overflow-hidden border rounded-lg bg-card shadow hover:translate-y-[-2px] duration-300">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">High Severity</CardTitle>

					<Zap className="h-4 w-4 text-orange-500" />
				</CardHeader>

				<CardContent>
					{renderMetric(isLoadingSeverity, highSeverityAlerts, 1)}

					<p className="text-xs text-muted-foreground">Severity 4-5 alerts</p>
				</CardContent>

				{isLoadingSeverity && (
					<div className="h-1 bg-blue-500/20 relative">
						<div className="absolute inset-0 h-1 bg-blue-500 animate-progress-bar"></div>
					</div>
				)}
			</Card>

			<Card className="transition-all hover:shadow-md overflow-hidden border rounded-lg bg-card shadow hover:translate-y-[-2px] duration-300">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Alert Types</CardTitle>

					<BarChart2 className="h-4 w-4 text-muted-foreground" />
				</CardHeader>

				<CardContent>
					{renderMetric(isLoadingType, uniqueTypes, 2)}

					<p className="text-xs text-muted-foreground">Unique alert categories</p>
				</CardContent>

				{isLoadingType && (
					<div className="h-1 bg-blue-500/20 relative">
						<div className="absolute inset-0 h-1 bg-blue-500 animate-progress-bar"></div>
					</div>
				)}
			</Card>

			<Card className="transition-all hover:shadow-md overflow-hidden border rounded-lg bg-card shadow hover:translate-y-[-2px] duration-300">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Applications</CardTitle>

					<ActivitySquare className="h-4 w-4 text-muted-foreground" />
				</CardHeader>

				<CardContent>
					{renderMetric(isLoadingApplication, uniqueApplications, 3)}

					<p className="text-xs text-muted-foreground">Affected applications</p>
				</CardContent>

				{isLoadingApplication && (
					<div className="h-1 bg-blue-500/20 relative">
						<div className="absolute inset-0 h-1 bg-blue-500 animate-progress-bar"></div>
					</div>
				)}
			</Card>
		</div>
	)
}

export default AlertMetricCards
