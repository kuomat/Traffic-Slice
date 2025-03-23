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
	PieChart,
	Pie,
	Cell
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAlertAnalytics, AnalyticsFilter } from "@/hooks/useAlertAnalytics"
import { useAlertTypes } from "@/hooks/useAlerts"
import { COLORS, chartTheme, CustomizedTooltip, CustomTooltip, renderContent } from "./ChartUtils"
import { BaseChartProps, PieChartDataPoint } from "./ChartTypes"

const AlertTypeChart: React.FC<BaseChartProps> = ({ startDate, endDate }) => {
	// Analytics filter
	const typeFilter = useMemo<AnalyticsFilter>(
		() => ({
			timeGroupBy: "day",
			dimensionGroupBy: "type",
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString()
		}),
		[startDate, endDate]
	)

	// Fetch data
	const { data: typeData, isLoading: isLoadingType } = useAlertAnalytics(typeFilter)
	const { data: alertTypes } = useAlertTypes()

	// Prepare data for pie chart (alert types)
	const formattedTypeData = useMemo(() => {
		if (!typeData) return []
		return typeData.map((item, index) => ({
			name: item.dimension_key,
			value: item.count,
			color: COLORS[index % COLORS.length]
		}))
	}, [typeData])

	return (
		<Card className="bg-gray-900 border-gray-800">
			<CardHeader>
				<CardTitle className="text-gray-100">Alerts by Type</CardTitle>
			</CardHeader>
			<CardContent>
				{renderContent(isLoadingType, typeData, () => (
					<div className="flex flex-col lg:flex-row items-center">
						<div className="w-full lg:w-1/2">
							<ResponsiveContainer width="100%" height={300}>
								<PieChart
									style={{
										backgroundColor: chartTheme.backgroundColor
									}}
								>
									<Pie
										data={formattedTypeData}
										cx="50%"
										cy="50%"
										labelLine={false}
										outerRadius={80}
										fill="#8884d8"
										dataKey="value"
										nameKey="name"
									>
										{formattedTypeData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip
										content={<CustomTooltip />}
										wrapperStyle={{ outline: "none" }}
										contentStyle={CustomizedTooltip.contentStyle}
									/>
									<Legend
										wrapperStyle={{ color: chartTheme.textColor }}
										formatter={value => (
											<span style={{ color: chartTheme.textColor }}>
												{value}
											</span>
										)}
									/>
								</PieChart>
							</ResponsiveContainer>
						</div>
						<div className="w-full lg:w-1/2">
							<ResponsiveContainer width="100%" height={300}>
								<BarChart
									layout="vertical"
									data={formattedTypeData}
									margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
									style={{
										backgroundColor: chartTheme.backgroundColor
									}}
								>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke={chartTheme.gridColor}
									/>
									<XAxis
										type="number"
										stroke={chartTheme.textColor}
										tick={{ fill: chartTheme.textColor }}
									/>
									<YAxis
										type="category"
										dataKey="name"
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
											<span style={{ color: chartTheme.textColor }}>
												{value}
											</span>
										)}
									/>
									<Bar dataKey="value" name="Count">
										{formattedTypeData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}

export default AlertTypeChart
