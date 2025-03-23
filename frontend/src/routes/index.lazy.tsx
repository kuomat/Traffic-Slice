import AlertTable from "@/components/AlertTable"
import AlertAnalyticsCharts from "@/components/AlertAnalyticsCharts"
import AlertMetricCards from "@/components/AlertMetricCards"
import { useNotableAlerts } from "@/hooks/useNotableAlerts"
import { createLazyFileRoute } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2 } from "lucide-react"

export const Route = createLazyFileRoute("/")({
	component: Index
})

function Index() {
	const { hasNotableAlerts, isLoading } = useNotableAlerts()

	return (
		<div className="p-2">
			<div className="p-4">
				<Tabs id="main-tabs" defaultValue="overview" className="w-full">
					<TabsList className="grid w-full max-w-md grid-cols-2">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="analytics">Analytics</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="mt-4">
						<div className="space-y-4">
							<AlertMetricCards />

							{isLoading ? (
								<div className="text-center py-8">Loading alerts...</div>
							) : hasNotableAlerts ? (
								<div className="space-y-4">
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-lg font-medium text-orange-500">
												Notable Alerts Detected
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground">
												There are high severity alerts that require your
												attention.
											</p>
										</CardContent>
									</Card>
									<AlertTable notableAlertsOnly />
								</div>
							) : (
								<div className="text-center py-8 flex flex-col items-center justify-center">
									<div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 shadow-sm max-w-md">
										<CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
										<p className="text-xl font-medium">
											All traffic screening clear
										</p>
										<p className="mt-2">
											No notable alerts among screened traffic within the last
											3 days
										</p>
									</div>
								</div>
							)}
						</div>
					</TabsContent>

					<TabsContent value="analytics" className="mt-4">
						<AlertAnalyticsCharts />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
