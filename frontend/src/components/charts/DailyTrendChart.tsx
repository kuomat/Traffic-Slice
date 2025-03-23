import React, { useMemo } from "react"
import { format, parseISO } from "date-fns"
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAlertAnalytics, AnalyticsFilter } from "@/hooks/useAlertAnalytics"
import {
	SEVERITY_COLORS,
	chartTheme,
	CustomizedTooltip,
	CustomTooltip,
	renderContent
} from "./ChartUtils"
import { BaseChartProps, DailyTrendDataPoint } from "./ChartTypes"

const DailyTrendChart: React.FC<BaseChartProps> = ({ startDate, endDate }) => {
	// Analytics filter
	const dailyFilter = useMemo<AnalyticsFilter>(
		() => ({
			timeGroupBy: "day",
			dimensionGroupBy: "severity",
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString()
		}),
		[startDate, endDate]
	)

	// Fetch data for chart
	const { data: dailyData, isLoading: isLoadingDaily } = useAlertAnalytics(dailyFilter)

	// Prepare data for daily trend chart by severity
	const formattedDailyData = useMemo(() => {
		if (!dailyData) return []

		// Group data by date first
		const dateGroups: { [date: string]: { [severity: string]: number } } = {}

		dailyData.forEach(item => {
			const dateStr = format(parseISO(item.time_key), "MMM dd")
			if (!dateGroups[dateStr]) {
				dateGroups[dateStr] = {}
			}
			dateGroups[dateStr][`severity${item.dimension_key}`] = item.count
		})

		// Convert to array format for Recharts
		return Object.entries(dateGroups).map(([date, severityCounts]) => ({
			date,
			...severityCounts
		}))
	}, [dailyData])

	return (
		<Card className="bg-gray-900 border-gray-800">
			<CardHeader>
				<CardTitle className="text-gray-100">Daily Alert Trend by Severity</CardTitle>
			</CardHeader>
			<CardContent>
				{renderContent(isLoadingDaily, dailyData, () => (
					<>
						<ResponsiveContainer width="100%" height={400}>
							<LineChart
								data={formattedDailyData}
								margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
								style={{ backgroundColor: chartTheme.backgroundColor }}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke={chartTheme.gridColor}
									vertical={true}
								/>
								<XAxis
									dataKey="date"
									stroke={chartTheme.textColor}
									tick={{ fill: chartTheme.textColor }}
								/>
								<YAxis
									stroke={chartTheme.textColor}
									tick={{ fill: chartTheme.textColor }}
								/>
								<Tooltip
									content={<CustomTooltip />}
									wrapperStyle={{ outline: "none" }}
									contentStyle={CustomizedTooltip.contentStyle}
									cursor={{
										stroke: chartTheme.gridColor,
										strokeWidth: 1
									}}
								/>
								<Legend
									wrapperStyle={{ color: chartTheme.textColor }}
									formatter={value => (
										<span style={{ color: chartTheme.textColor }}>{value}</span>
									)}
								/>
								{Object.keys(SEVERITY_COLORS).map(severity => (
									<Line
										key={severity}
										type="monotone"
										dataKey={`severity${severity}`}
										name={`Severity ${severity}`}
										stroke={
											SEVERITY_COLORS[
												severity as keyof typeof SEVERITY_COLORS
											]
										}
										activeDot={{ r: 8 }}
										connectNulls
									/>
								))}
							</LineChart>
						</ResponsiveContainer>
						<div className="flex flex-wrap gap-2 mt-4 justify-center">
							{Object.entries(SEVERITY_COLORS).map(([level, color]) => (
								<Badge
									key={level}
									style={{ backgroundColor: color }}
									className="text-white"
								>
									Severity {level}
								</Badge>
							))}
						</div>
					</>
				))}
			</CardContent>
		</Card>
	)
}

export default DailyTrendChart
