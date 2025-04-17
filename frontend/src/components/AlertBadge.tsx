import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AlertBadgeProps {
	severity: number
	className?: string
}

const AlertBadge: React.FC<AlertBadgeProps> = ({ severity, className }) => {
	// Get the appropriate severity class based on the severity level
	const getSeverityClass = () => {
		switch (severity) {
			case 5:
				return "bg-[rgb(var(--severity-5))] text-white border-0"
			case 4:
				return "bg-[rgb(var(--severity-4))] text-white border-0"
			case 3:
				return "bg-[rgb(var(--severity-3))] text-white border-0"
			case 2:
				return "bg-[rgb(var(--severity-2))] text-white border-0"
			case 1:
				return "bg-[rgb(var(--severity-1))] text-white border-0"
			default:
				return "bg-[rgb(var(--severity-1))] text-white border-0"
		}
	}

	return (
		<Badge variant="outline" className={cn(getSeverityClass(), className)}>
			{severity}
		</Badge>
	)
}

export default AlertBadge
