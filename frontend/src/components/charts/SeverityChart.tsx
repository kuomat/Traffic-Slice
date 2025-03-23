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
import {
	SEVERITY_COLORS,
	chartTheme,
	CustomizedTooltip,
	CustomTooltip,
	renderContent
} from "./ChartUtils"
import { BaseChartProps, PieChartDataPoint } from "./ChartTypes"

const SeverityChart: React.FC<BaseChartProps> = ({ startDate, endDate }) => {
	// Analytics filter
	const severityFilter = useMemo<AnalyticsFilter>(
		() => ({
			timeGroupBy: "day",
			dimensionGroupBy: "severity",
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString()
		}),
		[startDate, endDate]
	)

	// Fetch data
	const { data: severityData, isLoading: isLoadingSeverity } = useAlertAnalytics(severityFilter)

	// Prepare data for severity distribution
	const formattedSeverityData = useMemo(() => {
		if (!severityData) return []

		return severityData.map(item => ({
			name: `Severity ${item.dimension_key}`,
			value: item.count,
			color: SEVERITY_COLORS[item.dimension_key as keyof typeof SEVERITY_COLORS] || "#9c9c9c"
		}))
	}, [severityData])

	return (
		<Card className="bg-gray-900 border-gray-800">
			<CardHeader>
				<CardTitle className="text-gray-100">Alerts by Severity</CardTitle>
			</CardHeader>
			<CardContent>
				{renderContent(isLoadingSeverity, severityData, () => (
					<div className="flex flex-col lg:flex-row items-center">
						<div className="w-full lg:w-2/3">
							<ResponsiveContainer width="100%" height={300}>
								<BarChart
									data={formattedSeverityData}
									margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
									style={{
										backgroundColor: chartTheme.backgroundColor
									}}
								>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke={chartTheme.gridColor}
									/>
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
											<span style={{ color: chartTheme.textColor }}>
												{value}
											</span>
										)}
									/>
									<Bar dataKey="value" name="Count">
										{formattedSeverityData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						</div>
						<div className="w-full lg:w-1/3 flex justify-center">
							<ResponsiveContainer width="100%" height={300}>
								<PieChart
									style={{
										backgroundColor: chartTheme.backgroundColor
									}}
								>
									<Pie
										data={formattedSeverityData}
										cx="50%"
										cy="50%"
										labelLine={false}
										outerRadius={80}
										fill="#8884d8"
										dataKey="value"
										nameKey="name"
									>
										{formattedSeverityData.map((entry, index) => (
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
					</div>
				))}
			</CardContent>
		</Card>
	)
}

export default SeverityChart
