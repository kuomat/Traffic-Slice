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

const DestinationChart: React.FC<BaseChartProps> = ({ startDate, endDate }) => {
	// Analytics filter
	const destinationFilter = useMemo<AnalyticsFilter>(
		() => ({
			timeGroupBy: "day",
			dimensionGroupBy: "destination",
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString()
		}),
		[startDate, endDate]
	)

	// Fetch data
	const { data: destinationData, isLoading: isLoadingDestination } =
		useAlertAnalytics(destinationFilter)

	// Prepare data for destinations
	const formattedDestinationData = useMemo(() => {
		if (!destinationData) return []

		return destinationData
			.slice(0, 5) // Top 5 destinations
			.map((item, index) => ({
				name: item.dimension_key,
				count: item.count,
				color: COLORS[index % COLORS.length]
			}))
	}, [destinationData])

	return (
		<Card className="bg-gray-900 border-gray-800">
			<CardHeader>
				<CardTitle className="text-gray-100">Top Destinations</CardTitle>
			</CardHeader>
			<CardContent>
				{renderContent(isLoadingDestination, destinationData, () => (
					<ResponsiveContainer width="100%" height={400}>
						<BarChart
							data={formattedDestinationData}
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
								{formattedDestinationData.map((entry, index) => (
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

export default DestinationChart
