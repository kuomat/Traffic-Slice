import React from "react"
import { Alert } from "@/types/alerts"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import AlertBadge from "./AlertBadge"

interface AlertPopupProps {
	alert: Alert | null
	onClose: () => void
}

const AlertPopup: React.FC<AlertPopupProps> = ({ alert, onClose }) => {
	if (!alert) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
			<div className="relative w-full max-w-lg rounded-lg border border-border bg-background p-6 shadow-2xl">
				{/* Close button in the top-right corner */}
				<Button
					variant="ghost"
					size="icon"
					className="absolute right-4 top-4 rounded-full opacity-70 hover:opacity-100"
					onClick={onClose}
				>
					<X className="h-4 w-4" />
				</Button>

				<h2 className="text-2xl font-bold text-foreground mb-6">Alert Details</h2>

				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<strong className="text-muted-foreground min-w-[140px]">Severity:</strong>
						<AlertBadge severity={alert.severity} className="px-3 py-1" />
					</div>

					<div className="flex items-start gap-2">
						<strong className="text-muted-foreground min-w-[140px]">Alert Name:</strong>
						<span className="text-foreground">{alert.alert_name}</span>
					</div>

					<div className="flex items-start gap-2">
						<strong className="text-muted-foreground min-w-[140px]">Message:</strong>
						<span className="text-foreground break-words">{alert.message}</span>
					</div>

					<div className="flex items-start gap-2">
						<strong className="text-muted-foreground min-w-[140px]">
							Application:
						</strong>
						<span className="text-foreground">{alert.application_from}</span>
					</div>

					<div className="flex items-start gap-2">
						<strong className="text-muted-foreground min-w-[140px]">
							Destination:
						</strong>
						<span className="text-foreground">{alert.destination_domain}</span>
					</div>

					<div className="flex items-start gap-2">
						<strong className="text-muted-foreground min-w-[140px]">Timestamp:</strong>
						<span className="text-foreground">
							{new Date(alert.timestamp).toLocaleString()}
						</span>
					</div>
				</div>

				<div className="mt-8 flex justify-end">
					<Button variant="default" onClick={onClose}>
						Close
					</Button>
				</div>
			</div>
		</div>
	)
}

export default AlertPopup
