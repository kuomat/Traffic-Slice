import React, { useState, useMemo } from "react"
import { subDays } from "date-fns"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AlertAnalyticsChartsProps } from "./charts/ChartTypes"
import DailyTrendChart from "./charts/DailyTrendChart"
import SeverityChart from "./charts/SeverityChart"
import AlertTypeChart from "./charts/AlertTypeChart"
import ApplicationChart from "./charts/ApplicationChart"
import DestinationChart from "./charts/DestinationChart"
import { cn } from "@/lib/utils"

const AlertAnalyticsCharts: React.FC<AlertAnalyticsChartsProps> = props => {
	const defaultStartDate = useMemo(
		() => props.defaultStartDate || subDays(new Date(), 30),
		[props.defaultStartDate]
	)
	const defaultEndDate = useMemo(() => props.defaultEndDate || new Date(), [props.defaultEndDate])

	const [activeTab, setActiveTab] = useState<string>("daily")
	const [startDate] = useState<Date>(defaultStartDate)
	const [endDate] = useState<Date>(defaultEndDate)

	return (
		<div className="space-y-4">
			<Tabs id="chart-tabs" value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-5">
					<TabsTrigger
						value="daily"
						className={cn(
							"text-primary",
							activeTab === "daily" ? "text-primary font-medium" : "text-primary/70"
						)}
					>
						Daily Trend
					</TabsTrigger>
					<TabsTrigger
						value="severity"
						className={cn(
							"text-primary",
							activeTab === "severity"
								? "text-primary font-medium"
								: "text-primary/70"
						)}
					>
						By Severity
					</TabsTrigger>
					<TabsTrigger
						value="type"
						className={cn(
							"text-primary",
							activeTab === "type" ? "text-primary font-medium" : "text-primary/70"
						)}
					>
						By Alert Type
					</TabsTrigger>
					<TabsTrigger
						value="application"
						className={cn(
							"text-primary",
							activeTab === "application"
								? "text-primary font-medium"
								: "text-primary/70"
						)}
					>
						By Application
					</TabsTrigger>
					<TabsTrigger
						value="destination"
						className={cn(
							"text-primary",
							activeTab === "destination"
								? "text-primary font-medium"
								: "text-primary/70"
						)}
					>
						By Destination
					</TabsTrigger>
				</TabsList>

				<TabsContent value="daily" className="mt-4">
					<DailyTrendChart startDate={startDate} endDate={endDate} />
				</TabsContent>

				<TabsContent value="severity" className="mt-4">
					<SeverityChart startDate={startDate} endDate={endDate} />
				</TabsContent>

				<TabsContent value="type" className="mt-4">
					<AlertTypeChart startDate={startDate} endDate={endDate} />
				</TabsContent>

				<TabsContent value="application" className="mt-4">
					<ApplicationChart startDate={startDate} endDate={endDate} />
				</TabsContent>

				<TabsContent value="destination" className="mt-4">
					<DestinationChart startDate={startDate} endDate={endDate} />
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default AlertAnalyticsCharts
