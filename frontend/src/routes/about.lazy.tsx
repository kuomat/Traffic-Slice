<<<<<<< HEAD
import { createLazyFileRoute } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { motion } from "framer-motion"
import {
	Shield,
	Eye,
	Lock,
	AlertTriangle,
	Zap,
	Server,
	BarChart4,
	CheckCircle2,
	ArrowRight
} from "lucide-react"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
=======
import { createLazyFileRoute } from '@tanstack/react-router'
>>>>>>> origin/akash2

export const Route = createLazyFileRoute('/about')({
  component: About,
})

function About() {
<<<<<<< HEAD
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2
			}
		}
	}

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5
			}
		}
	}

	return (
		<div className="container mx-auto px-4 py-10 max-w-6xl">
			<motion.div
				className="space-y-10"
				initial="hidden"
				animate="visible"
				variants={containerVariants}
			>
				{/* Hero Section */}
				<motion.div variants={itemVariants} className="text-center mb-12">
					<h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
						Traffic Slice
					</h1>
					<p className="text-2xl font-medium text-muted-foreground">
						See What Leaves, Protect What Matters.
					</p>
				</motion.div>

				{/* Main Feature Card */}
				<motion.div variants={itemVariants}>
					<Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 shadow-lg">
						<CardHeader>
							<div className="flex items-center gap-3 mb-2">
								<Shield className="h-8 w-8 text-orange-600" />
								<CardTitle className="text-3xl">
									Take Control of Your Data
								</CardTitle>
							</div>
							<CardDescription className="text-lg">
								Do you really know what's happening with your data?
							</CardDescription>
						</CardHeader>
						<CardContent className="text-lg leading-relaxed">
							<p className="mb-4">
								In today's digital world, using loaner or work laptops is common—but
								how do you know what's happening under the hood? Is your data truly
								secure? Are your files, credentials, or personal information being
								sent out without your knowledge?
							</p>
							<p>
								Traffic Slice gives you full visibility into your laptop's network
								activity, tracking incoming and outgoing requests while highlighting
								sensitive data. With real-time monitoring and intuitive insights,
								you can stay informed and take action before potential risks become
								threats.
							</p>
						</CardContent>
					</Card>
				</motion.div>

				{/* Why We Built Section */}
				<motion.div variants={itemVariants}>
					<Card className="mb-8 overflow-hidden">
						<div className="grid md:grid-cols-5 gap-0">
							<div className="md:col-span-2 bg-gradient-to-br from-orange-500 to-amber-600 text-white p-8 flex items-center">
								<div>
									<h2 className="text-3xl font-bold mb-4">
										Why We Built Traffic Slice
									</h2>
									<p className="text-white/90">
										Bringing data transparency to everyone, not just security
										experts.
									</p>
								</div>
							</div>
							<div className="md:col-span-3 p-8">
								<p className="text-lg leading-relaxed">
									We've all been there—using a borrowed or company-issued laptop,
									unsure of what's running in the background. Traditional security
									tools can be complex and overwhelming, leaving users in the dark
									about their own data. Traffic Slice was designed to bridge that
									gap, providing a simple yet powerful way to understand and
									manage network traffic.
								</p>
							</div>
						</div>
					</Card>
				</motion.div>

				{/* How It Works */}
				<motion.div variants={itemVariants}>
					<h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
					<div className="grid md:grid-cols-3 gap-6 mb-8">
						<Card className="border border-orange-100 dark:border-orange-900 hover:shadow-md transition-all duration-300">
							<CardHeader>
								<div className="flex justify-center mb-4">
									<div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
										<Eye className="h-8 w-8 text-orange-600" />
									</div>
								</div>
								<CardTitle className="text-xl text-center">
									Monitors Your Network
								</CardTitle>
							</CardHeader>
							<CardContent className="text-center">
								<p>
									Tracks all incoming and outgoing requests from your device in
									real-time
								</p>
							</CardContent>
						</Card>

						<Card className="border border-amber-100 dark:border-amber-900 hover:shadow-md transition-all duration-300">
							<CardHeader>
								<div className="flex justify-center mb-4">
									<div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
										<AlertTriangle className="h-8 w-8 text-amber-600" />
									</div>
								</div>
								<CardTitle className="text-xl text-center">
									Detects Sensitive Data
								</CardTitle>
							</CardHeader>
							<CardContent className="text-center">
								<p>
									Flags when critical information might be leaving your laptop
									without permission
								</p>
							</CardContent>
						</Card>

						<Card className="border border-orange-100 dark:border-orange-900 hover:shadow-md transition-all duration-300">
							<CardHeader>
								<div className="flex justify-center mb-4">
									<div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
										<BarChart4 className="h-8 w-8 text-orange-600" />
									</div>
								</div>
								<CardTitle className="text-xl text-center">
									Provides Clear Insights
								</CardTitle>
							</CardHeader>
							<CardContent className="text-center">
								<p>
									Offers intuitive visualizations so you can understand and act
									with confidence
								</p>
							</CardContent>
						</Card>
					</div>
				</motion.div>

				{/* Final CTA */}
				<motion.div variants={itemVariants} className="text-center mt-12">
					<Card className="border-0 bg-gradient-to-r from-orange-500 to-amber-600 text-white p-8">
						<CardContent>
							<h2 className="text-2xl font-bold mb-4">
								Start Protecting Your Data Today
							</h2>
							<p className="mb-6 max-w-2xl mx-auto">
								With Traffic Slice, you don't have to be a cybersecurity expert to
								protect yourself. Whether you're a student, employee, or
								privacy-conscious individual, you deserve to know where your data is
								going—and now, you can.
							</p>
							<Link to="/" className="inline-block">
								<Button
									variant="outline"
									className="bg-white text-orange-600 hover:bg-white hover:text-orange-700 border-2 border-white"
								>
									Get Started <ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
						</CardContent>
					</Card>
				</motion.div>
			</motion.div>
		</div>
	)
=======
  return (
    <div className="container mx-auto p-6">
      {/* <h1 className="text-4xl font-bold mb-6 text-center">About Page</h1> */}
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold">
          Traffic Slice: See What Leaves, Protect What Matters.
        </h2>
        <h3 className="text-2xl font-semibold mt-4">
          Take Control of Your Data
        </h3>
        <p className="text-lg leading-relaxed">
          In today's digital world, using loaner or work laptops is common—but
          how do you know what's happening under the hood? Is your data truly
          secure? Are your files, credentials, or personal information being
          sent out without your knowledge?
        </p>
        <p className="text-lg leading-relaxed">
          Traffic Slice gives you full visibility into your laptop's network
          activity, tracking incoming and outgoing requests while highlighting
          sensitive data. With real-time monitoring and intuitive insights, you
          can stay informed and take action before potential risks become
          threats.
        </p>
        <h3 className="text-2xl font-semibold mt-4">
          Why We Built Traffic Slice
        </h3>
        <p className="text-lg leading-relaxed">
          We've all been there—using a borrowed or company-issued laptop, unsure
          of what's running in the background. Traditional security tools can be
          complex and overwhelming, leaving users in the dark about their own
          data. Traffic Slice was designed to bridge that gap, providing a
          simple yet powerful way to understand and manage network traffic.
        </p>
        <h3 className="text-2xl font-semibold mt-4">How It Works</h3>
        <ul className="list-disc list-inside text-lg leading-relaxed">
          <li>
            Monitors Your Network Traffic – Tracks requests going in and out of
            your device.
          </li>
          <li>
            Detects Sensitive Data Transfers – Flags when critical information
            might be leaving your laptop.
          </li>
          <li>
            Provides Clear Insights – Offers an easy-to-understand interface so
            you can act with confidence.
          </li>
        </ul>
        <p className="text-lg leading-relaxed">
          With Traffic Slice, you don't have to be a cybersecurity expert to
          protect yourself. Whether you're a student, employee, or
          privacy-conscious individual, you deserve to know where your data is
          going—and now, you can.
        </p>
      </div>
    </div>
  )
>>>>>>> origin/akash2
}
