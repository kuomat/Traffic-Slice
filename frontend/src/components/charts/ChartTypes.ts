import { TimeGroupBy, DimensionGroupBy } from "@/hooks/useAlertAnalytics"

// Props for the overall AlertAnalyticsCharts component
export type AlertAnalyticsChartsProps = {
	defaultStartDate?: Date
	defaultEndDate?: Date
}

// Common props for all chart components
export type BaseChartProps = {
	startDate: Date
	endDate: Date
}

// Data types for formatted chart data
export type DailyTrendDataPoint = {
	date: string
	[key: string]: number | string // severity1, severity2, etc.
}

export type PieChartDataPoint = {
	name: string
	value: number
	color: string
}

export type BarChartDataPoint = {
	name: string
	count: number
	color: string
}
