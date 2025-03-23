import { createLazyFileRoute } from "@tanstack/react-router"
import AlertAnalyticsCharts from "@/components/AlertAnalyticsCharts"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, subDays } from "date-fns"
import { DatePicker } from "@/components/ui/date-picker"

export const Route = createLazyFileRoute("/analytics")({
	component: Analytics
})

function Analytics() {
	const [startDate, setStartDate] = useState<Date | undefined>(subDays(new Date(), 7))
	const [endDate, setEndDate] = useState<Date | undefined>(new Date())

	return (
		<div className="p-2">
			<div className="p-4">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold">Alert Analytics</h1>
				</div>

				<Card className="mb-4">
					<CardHeader>
						<CardTitle>Date Range</CardTitle>
						<CardDescription>Select date range for analytics</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col sm:flex-row gap-3">
						<div className="flex-1">
							<span className="text-sm font-medium mb-2 block">Start Date</span>
							<DatePicker
								date={startDate}
								setDate={setStartDate}
								placeholder="Start date"
							/>
						</div>
						<div className="flex-1">
							<span className="text-sm font-medium mb-2 block">End Date</span>
							<DatePicker
								date={endDate}
								setDate={setEndDate}
								placeholder="End date"
							/>
						</div>
						<div className="flex-1 flex items-end">
							<p className="text-sm text-muted-foreground pb-[10px]">
								{startDate && endDate
									? `Showing data from ${format(startDate, "MMM dd, yyyy")} to ${format(endDate, "MMM dd, yyyy")}`
									: "Please select date range"}
							</p>
						</div>
					</CardContent>
				</Card>

				<Tabs id="analytics-tabs" defaultValue="charts" className="w-full">
					<TabsList className="grid w-full max-w-md grid-cols-2">
						<TabsTrigger value="charts">Charts</TabsTrigger>
						<TabsTrigger value="tables">Tables</TabsTrigger>
					</TabsList>

					<TabsContent value="charts" className="mt-4">
						<AlertAnalyticsCharts
							defaultStartDate={startDate}
							defaultEndDate={endDate}
						/>
					</TabsContent>

					<TabsContent value="tables" className="mt-4">
						<div className="text-center py-10 text-muted-foreground">
							Table view is available in the detailed analytics section
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
