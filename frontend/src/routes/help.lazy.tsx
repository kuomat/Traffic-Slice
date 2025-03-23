import { createLazyFileRoute } from "@tanstack/react-router"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import {
	HelpCircle,
	Globe,
	Send,
	Download,
	AlertCircle,
	Key,
	Lock,
	FileText,
	Clock,
	MapPin,
	Clipboard,
	Settings,
	Shield,
	Info,
	CheckCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const Route = createLazyFileRoute("/help")({
	component: Help
})

function AnimatedSection({
	children,
	delay = 0,
	className = ""
}: {
	children: React.ReactNode
	delay?: number
	className?: string
}) {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, amount: 0.1 })

	return (
		<motion.div
			ref={ref}
			className={className}
			initial={{ opacity: 0, y: 50 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
			transition={{ duration: 0.7, delay: delay * 0.1 }}
		>
			{children}
		</motion.div>
	)
}

function Help() {
	return (
		<div className="container mx-auto px-4 py-10 max-w-6xl">
			<div className="space-y-12">
				{/* Hero Section */}
				<AnimatedSection className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-6">
						<HelpCircle className="h-10 w-10 text-orange-600" />
					</div>
					<h1 className="text-4xl font-bold mb-4">How to Use Traffic Slice</h1>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						Your step-by-step guide to understanding network traffic and protecting your
						data
					</p>
				</AnimatedSection>

				{/* Introduction Card */}
				<AnimatedSection delay={1}>
					<Card className="border-orange-100 dark:border-orange-800 shadow-md mb-8">
						<CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 text-white">
							<CardTitle className="text-2xl">Getting Started</CardTitle>
							<CardDescription className="text-white/80 text-base">
								What you need to know before diving in
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<p className="text-lg leading-relaxed mb-4">
								Here is your step-by-step guide on how to navigate this app:
							</p>
							<p className="text-lg leading-relaxed">
								If you want more background on what is represented on this app keep
								reading otherwise skip to Actionable Steps.
							</p>
						</CardContent>
					</Card>
				</AnimatedSection>

				{/* Understanding Requests Section */}
				<AnimatedSection delay={2}>
					<h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
						<Globe className="h-8 w-8 text-orange-600" />
						Understanding Network Requests
					</h2>

					<Card className="mb-6 overflow-hidden">
						<CardHeader>
							<CardTitle>What Even Is a Request?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-lg leading-relaxed mb-4">
								A request refers to any network communication between your laptop
								and external servers or devices. This happens when your laptop sends
								or receives data over the internet or a local network.
							</p>

							<div className="grid md:grid-cols-2 gap-6 mt-8">
								<AnimatedSection
									delay={3}
									className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg"
								>
									<div className="flex items-center gap-3 mb-4">
										<div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
											<Send className="h-6 w-6 text-orange-600" />
										</div>
										<h3 className="text-xl font-semibold">Outbound Requests</h3>
									</div>
									<p className="text-muted-foreground mb-3">
										Sent from Your Laptop
									</p>
									<ul className="space-y-2">
										<li className="flex items-start gap-2">
											<CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
											<span>
												Visiting a website (browser requesting data)
											</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
											<span>
												Sending emails or uploading to cloud storage
											</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
											<span>Software updates checking for new versions</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
											<span>Background processes transmitting data</span>
										</li>
									</ul>
								</AnimatedSection>

								<AnimatedSection
									delay={4}
									className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg"
								>
									<div className="flex items-center gap-3 mb-4">
										<div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
											<Download className="h-6 w-6 text-amber-600" />
										</div>
										<h3 className="text-xl font-semibold">Inbound Requests</h3>
									</div>
									<p className="text-muted-foreground mb-3">
										Received by Your Laptop
									</p>
									<ul className="space-y-2">
										<li className="flex items-start gap-2">
											<CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
											<span>Responses from websites or services</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
											<span>
												Remote connections attempting to access your system
											</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
											<span>File downloads or software updates</span>
										</li>
									</ul>
								</AnimatedSection>
							</div>
						</CardContent>
					</Card>
				</AnimatedSection>

				{/* Why Care Section */}
				<AnimatedSection delay={4}>
					<Card className="border-orange-100 dark:border-orange-800 shadow-md mb-8">
						<CardHeader>
							<div className="flex items-center gap-3">
								<AlertCircle className="h-7 w-7 text-orange-600" />
								<CardTitle className="text-2xl">
									Why Should I Care About These?
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-lg leading-relaxed mb-6">
								Every time your laptop connects to the internet, it sends and
								receives requests—small packets of data that contain information
								about what you're doing online. These requests power everything from
								loading web pages to syncing cloud files. But here's the catch: not
								all requests are harmless, and not all are transparent.
							</p>

							<AnimatedSection
								delay={4}
								className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg mb-6"
							>
								<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
									<Key className="h-5 w-5 text-orange-600" />
									Requests Carry Your Data—Including Sensitive Information
								</h3>
								<p className="mb-4">
									Many requests contain personal, financial, or work-related data,
									sometimes without you even realizing it. For example:
								</p>
								<ul className="space-y-3">
									<li className="flex items-start gap-3">
										<Lock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
										<span>
											<strong>Login Credentials:</strong> When you sign in to
											a website or service, your username and password are
											transmitted in a request.
										</span>
									</li>
									<li className="flex items-start gap-3">
										<Lock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
										<span>
											<strong>Financial Information:</strong> Online banking,
											payments, and e-commerce transactions rely on requests
											to process your details.
										</span>
									</li>
									<li className="flex items-start gap-3">
										<Lock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
										<span>
											<strong>Browsing History & Metadata:</strong> Websites
											track your activity, collecting insights about your
											behavior and preferences.
										</span>
									</li>
									<li className="flex items-start gap-3">
										<Lock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
										<span>
											<strong>Work & School Data:</strong> Background
											processes might be sending data to third-party servers
											without clear disclosure.
										</span>
									</li>
								</ul>
							</AnimatedSection>

							<AnimatedSection
								delay={4}
								className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg"
							>
								<h3 className="text-xl font-semibold mb-3">
									Not All Requests Are Visible to You
								</h3>
								<p className="text-lg">
									Many applications and services run in the background, sending
									requests that you're not even aware of.
								</p>
							</AnimatedSection>
						</CardContent>
					</Card>
				</AnimatedSection>

				{/* What Our App Does Section */}
				<AnimatedSection delay={4}>
					<h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
						<Shield className="h-8 w-8 text-orange-600" />
						What Does Traffic Slice Do?
					</h2>

					<p className="text-lg leading-relaxed mb-6">
						Every request your laptop makes can contain valuable and sensitive
						information—but manually inspecting network traffic is complicated,
						time-consuming, and requires technical expertise. That's where Traffic Slice
						comes in.
					</p>

					<Card className="mb-6">
						<CardHeader>
							<CardTitle>How We Analyze Your Requests</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="mb-4">
								Our system monitors and scans each request in real-time, looking for
								potential risks by analyzing:
							</p>
							<div className="grid md:grid-cols-3 gap-4 mt-6">
								<AnimatedSection
									delay={4}
									className="border border-orange-100 dark:border-orange-900/30 rounded-lg p-4 flex flex-col items-center text-center"
								>
									<FileText className="h-8 w-8 text-orange-600 mb-3" />
									<h4 className="font-medium mb-2">Data Being Sent</h4>
									<p className="text-sm text-muted-foreground">
										We check for personal information, credentials, financial
										details, or work-related files that could be unintentionally
										exposed.
									</p>
								</AnimatedSection>
								<AnimatedSection
									delay={4}
									className="border border-orange-100 dark:border-orange-900/30 rounded-lg p-4 flex flex-col items-center text-center"
								>
									<Globe className="h-8 w-8 text-orange-600 mb-3" />
									<h4 className="font-medium mb-2">Where It's Going</h4>
									<p className="text-sm text-muted-foreground">
										We examine the destination of each request—whether it's a
										trusted service, a third-party tracker, or an unknown
										server.
									</p>
								</AnimatedSection>
								<AnimatedSection
									delay={4}
									className="border border-orange-100 dark:border-orange-900/30 rounded-lg p-4 flex flex-col items-center text-center"
								>
									<AlertCircle className="h-8 w-8 text-orange-600 mb-3" />
									<h4 className="font-medium mb-2">Suspicious Patterns</h4>
									<p className="text-sm text-muted-foreground">
										Unusual spikes in data transmission, frequent connections,
										or unexpected outbound traffic can indicate security risks.
									</p>
								</AnimatedSection>
							</div>
						</CardContent>
					</Card>
				</AnimatedSection>

				{/* Actionable Steps Section */}
				<AnimatedSection delay={4}>
					<h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
						<CheckCircle className="h-8 w-8 text-orange-600" />
						Actionable Steps: What to Do When You See a Warning
					</h2>

					<Card className="mb-8">
						<CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 text-white">
							<CardTitle>General Guidelines</CardTitle>
							<CardDescription className="text-white/90">
								If you notice an application repeatedly requesting sensitive
								information
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<ul className="space-y-3">
								<li className="flex items-start gap-3">
									<CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
									<span>
										<strong>Review access permissions</strong> – Limit or revoke
										unnecessary permissions.
									</span>
								</li>
								<li className="flex items-start gap-3">
									<CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
									<span>
										<strong>Monitor its behavior</strong> – Check if the app's
										activity aligns with its intended function.
									</span>
								</li>
								<li className="flex items-start gap-3">
									<CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
									<span>
										<strong>Consider uninstalling</strong> – If the behavior
										seems unnecessary or suspicious, removing the app may be the
										safest choice.
									</span>
								</li>
							</ul>
						</CardContent>
					</Card>
				</AnimatedSection>

				<AnimatedSection delay={4}>
					<h3 className="text-2xl font-bold mb-4">Threat Levels and How to Respond</h3>

					<div className="space-y-4 mb-8">
						<AnimatedSection
							delay={9}
							className="border-orange-200 dark:border-orange-800"
						>
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-lg flex items-center gap-2">
										<FileText className="h-5 w-5 text-orange-600" />
										Level One: Filenames
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="mb-3">
										Many requests include filenames—this is often normal,
										especially for cloud services and backup tools.
									</p>
									<p>
										<strong className="text-orange-600">Action:</strong> If an
										application is accessing particularly sensitive files (e.g.,
										tax documents, passwords, work projects), investigate
										further. If the request seems unnecessary, consider
										uninstalling the application.
									</p>
								</CardContent>
							</Card>
						</AnimatedSection>

						<AnimatedSection delay={4}>
							<Card className="border-orange-200 dark:border-orange-800">
								<CardHeader className="pb-2">
									<CardTitle className="text-lg flex items-center gap-2">
										<Clock className="h-5 w-5 text-orange-600" />
										Level Two: Timestamps
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="mb-3">
										Timestamps track when files, actions, or events occur.
									</p>
									<p>
										<strong className="text-orange-600">Action:</strong> If an
										application is sending timestamps linked to sensitive
										actions (e.g., login attempts, work schedules), check if
										it's necessary. If not, restrict its access.
									</p>
								</CardContent>
							</Card>
						</AnimatedSection>

						<AnimatedSection delay={4}>
							<Card className="border-orange-200 dark:border-orange-800">
								<CardHeader className="pb-2">
									<CardTitle className="text-lg flex items-center gap-2">
										<MapPin className="h-5 w-5 text-orange-600" />
										Level Three: Locations
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="mb-3">
										Some apps request location data for legitimate reasons, like
										maps or weather services, but others may track your
										whereabouts unnecessarily.
									</p>
									<p>
										<strong className="text-orange-600">Action:</strong> Review
										the app's permissions and disable location access if it
										doesn't need it.
									</p>
								</CardContent>
							</Card>
						</AnimatedSection>

						<AnimatedSection delay={4}>
							<Card className="border-orange-200 dark:border-orange-800">
								<CardHeader className="pb-2">
									<CardTitle className="text-lg flex items-center gap-2">
										<Clipboard className="h-5 w-5 text-orange-600" />
										Level Four: Clipboard Data
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="mb-3">
										Your clipboard may contain passwords, addresses, or other
										private data.
									</p>
									<p>
										<strong className="text-orange-600">Action:</strong> If an
										app is frequently accessing clipboard data without a clear
										reason, it could be logging your information. Disable
										clipboard access or remove the app.
									</p>
								</CardContent>
							</Card>
						</AnimatedSection>

						<AnimatedSection delay={3}>
							<Card className="border-orange-200 dark:border-orange-800">
								<CardHeader className="pb-2">
									<CardTitle className="text-lg flex items-center gap-2">
										<Settings className="h-5 w-5 text-orange-600" />
										Level Five: Environment Variables
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="mb-3">
										These store system and user-specific settings, including API
										keys, session tokens, and system paths. If you are a
										non-technical user, you probably don't have to worry about
										this happening.
									</p>
									<p>
										<strong className="text-orange-600">Action:</strong> If an
										application is accessing sensitive environment variables, it
										could be a major security risk. Immediately restrict its
										access and consider uninstalling the app.
									</p>
								</CardContent>
							</Card>
						</AnimatedSection>
					</div>
				</AnimatedSection>

				<AnimatedSection delay={4}>
					<Card className="border-orange-200 dark:border-orange-800">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Info className="h-5 w-5 text-orange-600" />
								Final Steps
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-3">
								<li className="flex items-start gap-3">
									<CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
									<span>
										If in doubt, block the request and investigate the app.
									</span>
								</li>
								<li className="flex items-start gap-3">
									<CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
									<span>Regularly review permissions for apps you install.</span>
								</li>
								<li className="flex items-start gap-3">
									<CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
									<span>
										Keep your software updated to prevent security
										vulnerabilities.
									</span>
								</li>
							</ul>
							<p className="mt-4 text-lg">
								By following these steps, you ensure that your data stays in your
								control and your device remains secure.
							</p>
						</CardContent>
					</Card>
				</AnimatedSection>
			</div>
		</div>
	)
}
