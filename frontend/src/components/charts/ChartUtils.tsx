import React from "react"

// Colors for charts
export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"]
export const SEVERITY_COLORS = {
	"1": "rgb(var(--severity-1))", // Severity level 1
	"2": "rgb(var(--severity-2))", // Severity level 2
	"3": "rgb(var(--severity-3))", // Severity level 3
	"4": "rgb(var(--severity-4))", // Severity level 4
	"5": "rgb(var(--severity-5))" // Severity level 5
}

// Chart theme styling
export const chartTheme = {
	backgroundColor: "#111827", // Dark background
	textColor: "#e5e7eb", // Light text
	gridColor: "#374151", // Grid lines color
	tooltipStyle: {
		backgroundColor: "#1f2937",
		border: "none",
		borderRadius: "4px",
		color: "#e5e7eb"
	}
}

// Custom styles for Recharts components
export const CustomizedTooltip = {
	contentStyle: {
		backgroundColor: "#1f2937",
		border: "none",
		borderRadius: "4px",
		boxShadow: "0 2px 5px rgba(0,0,0,0.5)"
	}
}

// Custom tooltip component for consistent styling
export const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="p-2 bg-gray-800 border-none rounded-md text-gray-100 shadow-md">
				<p className="font-medium text-primary">{label}</p>
				{payload.map((entry: any, index: number) => (
					<p key={index} className="text-white">
						<span style={{ color: entry.color || entry.stroke }}>●</span> {entry.name}:{" "}
						{entry.value}
					</p>
				))}
			</div>
		)
	}
	return null
}

// Loading and no data states
export const renderLoading = () => (
	<div className="flex items-center justify-center h-64">
		<p className="text-muted-foreground">Loading chart data...</p>
	</div>
)

export const renderNoData = () => (
	<div className="flex flex-col items-center justify-center h-64">
		<p className="text-muted-foreground">No data available for the selected period.</p>
		<p className="text-sm text-muted-foreground mt-2">
			Try selecting a different date range or check that alerts exist in the system.
		</p>
	</div>
)

// Helper function to determine what to render
export const renderContent = (
	isLoading: boolean,
	data: any[] | undefined,
	renderChart: () => React.ReactNode
) => {
	// If we have data, render the chart regardless of loading state
	if (data && data.length > 0) {
		return renderChart()
	}

	// If we're loading and don't have data, show loading
	if (isLoading) {
		return renderLoading()
	}

	// If we're not loading and don't have data, show no data
	return renderNoData()
}
