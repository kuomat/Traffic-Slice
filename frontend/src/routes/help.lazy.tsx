import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/help")({
	component: Help
})

function Help() {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Help Center</h1>
			<p>
				Welcome to the help center. Here you'll find guides and documentation to help you
				use our dashboard.
			</p>
		</div>
	)
}
