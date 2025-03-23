import React, { useMemo } from "react"
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Cell
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAlertAnalytics, AnalyticsFilter } from "@/hooks/useAlertAnalytics"
import { COLORS, chartTheme, CustomizedTooltip, CustomTooltip, renderContent } from "./ChartUtils"
import { BaseChartProps, BarChartDataPoint } from "./ChartTypes"

const ApplicationChart: React.FC<BaseChartProps> = ({ startDate, endDate }) => {
	// Analytics filter
	const applicationFilter = useMemo<AnalyticsFilter>(
		() => ({
			timeGroupBy: "day",
			dimensionGroupBy: "application",
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString()
		}),
		[startDate, endDate]
	)

	// Fetch data
	const { data: applicationData, isLoading: isLoadingApplication } =
		useAlertAnalytics(applicationFilter)

	// Prepare data for application source
	const formattedApplicationData = useMemo(() => {
		if (!applicationData) return []

		return applicationData
			.slice(0, 5) // Top 5 applications
			.map((item, index) => ({
				name: item.dimension_key,
				count: item.count,
				color: COLORS[index % COLORS.length]
			}))
	}, [applicationData])

	return (
		<Card className="bg-gray-900 border-gray-800">
			<CardHeader>
				<CardTitle className="text-gray-100">Top Applications</CardTitle>
			</CardHeader>
			<CardContent>
				{renderContent(isLoadingApplication, applicationData, () => (
					<ResponsiveContainer width="100%" height={400}>
						<BarChart
							data={formattedApplicationData}
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
							style={{ backgroundColor: chartTheme.backgroundColor }}
						>
							<CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
							<XAxis
								dataKey="name"
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
								cursor={{ fill: "rgba(55, 65, 81, 0.3)" }}
							/>
							<Legend
								wrapperStyle={{ color: chartTheme.textColor }}
								formatter={value => (
									<span style={{ color: chartTheme.textColor }}>{value}</span>
								)}
							/>
							<Bar dataKey="count" name="Alert Count">
								{formattedApplicationData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				))}
			</CardContent>
		</Card>
	)
}

export default ApplicationChart
