import { createLazyFileRoute } from "@tanstack/react-router"
import AlertTable from "@/components/AlertTable"

export const Route = createLazyFileRoute("/alerts")({
	component: Alerts
})

function Alerts() {
	return (
		<div className="p-2">
			<div className="p-4">
				<AlertTable />
			</div>
		</div>
	)
}
