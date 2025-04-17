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
import { BaseChartProps } from "./ChartTypes"
import { useNavigate } from "@tanstack/react-router"

const SeverityChart: React.FC<BaseChartProps> = ({ startDate, endDate }) => {
	const navigate = useNavigate()

	// Analytics filter
	const severityFilter = useMemo<AnalyticsFilter>(
		() => ({
			timeGroupBy: "month",
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

		// Aggregate counts by severity level
		const aggregatedData: Record<string, number> = {}

		severityData.forEach(item => {
			const severityKey = item.dimension_key || "unknown"
			aggregatedData[severityKey] = (aggregatedData[severityKey] || 0) + item.count
		})

		// Convert to array format for charts
		return Object.entries(aggregatedData).map(([key, count]) => ({
			name: `Severity ${key}`,
			value: count,
			severity: parseInt(key),
			color: SEVERITY_COLORS[key as keyof typeof SEVERITY_COLORS] || "#9c9c9c"
		}))
	}, [severityData])

	// Handle bar click
	const handleBarClick = (data: any) => {
		if (data && data.severity) {
			navigate({
				to: "/alerts",
				search: {
					severity: data.severity
				}
			})
		}
	}

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
									<Bar
										dataKey="value"
										name="Count"
										onClick={handleBarClick}
										style={{ cursor: "pointer" }}
									>
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
										onClick={handleBarClick}
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
