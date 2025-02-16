import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/alerts")({
	component: Alerts
})

function Alerts() {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Alert List</h1>
			<p>View and manage your alerts here.</p>
		</div>
	)
}
