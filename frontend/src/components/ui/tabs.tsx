import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
	id?: string
}

const Tabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
	({ id = "default", ...props }, ref) => (
		<TabsPrimitive.Root ref={ref} {...props} data-tab-group-id={id} />
	)
)
Tabs.displayName = TabsPrimitive.Root.displayName

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
	<motion.div
		initial={{ opacity: 0, y: -10 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.3 }}
	>
		<TabsPrimitive.List
			ref={ref}
			className={cn(
				"inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground relative",
				className
			)}
			{...props}
		/>
	</motion.div>
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
	const [isActive, setIsActive] = React.useState(false)
	const triggerRef = React.useRef<HTMLButtonElement | null>(null)
	const [tabGroupId, setTabGroupId] = React.useState("default")

	// Use a ref to store the component ref
	const handleRef = React.useCallback(
		(element: HTMLButtonElement | null) => {
			if (element) {
				triggerRef.current = element
				// Forward the ref
				if (typeof ref === "function") {
					ref(element)
				} else if (ref) {
					;(ref as React.MutableRefObject<HTMLButtonElement | null>).current = element
				}

				// Find parent tab group id
				const closestTabs = element.closest("[data-tab-group-id]")
				if (closestTabs) {
					setTabGroupId(closestTabs.getAttribute("data-tab-group-id") || "default")
				}
			}
		},
		[ref]
	)

	// Check for active state on mount and updates
	React.useEffect(() => {
		const checkIfActive = () => {
			if (triggerRef.current) {
				setIsActive(triggerRef.current.getAttribute("data-state") === "active")
			}
		}

		checkIfActive()

		// Create a mutation observer to watch for attribute changes
		const observer = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (mutation.type === "attributes" && mutation.attributeName === "data-state") {
					checkIfActive()
				}
			})
		})

		if (triggerRef.current) {
			observer.observe(triggerRef.current, { attributes: true })
		}

		return () => observer.disconnect()
	}, [])

	return (
		<TabsPrimitive.Trigger
			ref={handleRef}
			className={cn(
				"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative z-10",
				isActive ? "text-foreground" : "text-muted-foreground",
				className
			)}
			{...props}
		>
			<motion.div
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				transition={{ duration: 0.2 }}
				className="w-full h-full flex items-center justify-center"
			>
				{props.children}
			</motion.div>
			{isActive && (
				<motion.div
					className="absolute inset-0 bg-background rounded-sm shadow-sm -z-10"
					layoutId={`activeTab-${tabGroupId}`}
					transition={{ type: "spring", duration: 0.5 }}
				/>
			)}
		</TabsPrimitive.Trigger>
	)
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			className
		)}
		{...props}
	>
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.3 }}
		>
			{props.children}
		</motion.div>
	</TabsPrimitive.Content>
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
