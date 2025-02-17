import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/help")({
	component: Help
})

function Help() {
	return (
		<div className="container mx-auto p-6">
			<h1 className="text-4xl font-bold mb-6 text-center">Help Center</h1>
			<div className="space-y-6">
				<p className="text-lg leading-relaxed">
					Here is your step-by-step guide on how to navigate this app:
				</p>
				<p className="text-lg leading-relaxed">
					If you want more background on what is represented on this app keep reading
					otherwise skip to Actionable Steps.
				</p>
				<h2 className="text-3xl font-semibold mt-4">First, what even is a request?</h2>
				<p className="text-lg leading-relaxed">
					A request refers to any network communication between your laptop and external
					servers or devices. This happens when your laptop sends or receives data over
					the internet or a local network. Examples include:
				</p>
				<h3 className="text-2xl font-semibold mt-4">
					Outbound Requests (Sent from Your Laptop)
				</h3>
				<ul className="list-disc list-inside text-lg leading-relaxed">
					<li>Visiting a website (your browser requests data from a web server)</li>
					<li>Sending an email or a file to cloud storage</li>
					<li>Software updates checking for new versions</li>
					<li>Background processes transmitting data without your knowledge</li>
				</ul>
				<h3 className="text-2xl font-semibold mt-4">
					Inbound Requests (Received by Your Laptop)
				</h3>
				<ul className="list-disc list-inside text-lg leading-relaxed">
					<li>Responses from websites or services you interact with</li>
					<li>Remote connections attempting to access your system</li>
					<li>File downloads or software updates coming from a server</li>
				</ul>
				<h2 className="text-3xl font-semibold mt-4">Why should I care about these?</h2>
				<p className="text-lg leading-relaxed">
					Every time your laptop connects to the internet, it sends and receives
					requests—small packets of data that contain information about what you're doing
					online. These requests power everything from loading web pages to syncing cloud
					files. But here's the catch: not all requests are harmless, and not all are
					transparent.
				</p>
				<h3 className="text-2xl font-semibold mt-4">
					Requests Carry Your Data—Including Sensitive Information
				</h3>
				<p className="text-lg leading-relaxed">
					Many requests contain personal, financial, or work-related data, sometimes
					without you even realizing it. For example:
				</p>
				<ul className="list-disc list-inside text-lg leading-relaxed">
					<li>
						Login Credentials: When you sign in to a website or service, your username
						and password are transmitted in a request. If not properly secured, this
						data could be intercepted.
					</li>
					<li>
						Financial Information: Online banking, payments, and e-commerce transactions
						rely on requests to process your details.
					</li>
					<li>
						Browsing History & Metadata: Websites track your activity, collecting
						insights about your behavior, preferences, and location.
					</li>
					<li>
						Work & School Data: If you're using a loaner or company-issued laptop,
						background processes might be sending data to third-party servers—sometimes
						without clear disclosure.
					</li>
				</ul>
				<h3 className="text-2xl font-semibold mt-4">Not All Requests Are Visible to You</h3>
				<p className="text-lg leading-relaxed">
					Many applications and services run in the background, sending requests that
					you're not even aware of.
				</p>
				<h2 className="text-3xl font-semibold mt-4">What does our app do?</h2>
				<p className="text-lg leading-relaxed">
					Every request your laptop makes can contain valuable and sensitive
					information—but manually inspecting network traffic is complicated,
					time-consuming, and requires technical expertise. That's where Traffic Slice
					comes in.
				</p>
				<h3 className="text-2xl font-semibold mt-4">How We Analyze Your Requests</h3>
				<p className="text-lg leading-relaxed">
					Our system monitors and scans each request in real-time, looking for potential
					risks by analyzing:
				</p>
				<ul className="list-disc list-inside text-lg leading-relaxed">
					<li>
						Data Being Sent: We check for personal information, credentials, financial
						details, or work-related files that could be unintentionally exposed.
					</li>
					<li>
						Where It's Going: We examine the destination of each request—whether it's a
						trusted service, a third-party tracker, or an unknown server.
					</li>
					<li>
						Patterns of Suspicious Behavior: Unusual spikes in data transmission,
						frequent connections to external servers, or unexpected outbound traffic can
						indicate security risks.
					</li>
				</ul>
				<h3 className="text-2xl font-semibold mt-4">
					Highlighting Potentially Compromising Data
				</h3>
				<p className="text-lg leading-relaxed">
					Rather than overwhelming you with complex raw data, Traffic Slice presents key
					insights in a clear and readable way:
				</p>
				<ul className="list-disc list-inside text-lg leading-relaxed">
					<li>
						🔍 Easy-to-Read Request Logs – Instead of long strings of unreadable code,
						we show what data is being transmitted, where it's going, and why it
						matters.
					</li>
					<li>
						⚠️ Alerts on Sensitive Data Transfers – If we detect highly compromising
						data being sent somewhere unexpected, you'll be notified.
					</li>
					<li>
						📊 Intuitive Dashboard – A simple interface that categorizes and visualizes
						your traffic so you can quickly understand what's happening.
					</li>
				</ul>
				<p className="text-lg leading-relaxed">
					With Traffic Slice, you don't need to be a cybersecurity expert to take control
					of your data—we analyze the risks for you, highlight what matters, and help you
					stay secure.
				</p>
				<h2 className="text-3xl font-semibold mt-4">
					Actionable Steps: What to Do When You See a Warning
				</h2>
				<p className="text-lg leading-relaxed">
					If Traffic Slice detects a potentially compromising request, follow these steps
					to assess and protect your data.
				</p>
				<h3 className="text-2xl font-semibold mt-4">General Guidelines</h3>
				<p className="text-lg leading-relaxed">
					If you notice an application repeatedly requesting sensitive information, it's a
					red flag. You should:
				</p>
				<ul className="list-disc list-inside text-lg leading-relaxed">
					<li>
						✅ Review its access permissions – Limit or revoke unnecessary permissions.
					</li>
					<li>
						✅ Monitor its behavior – Check if the app's activity aligns with its
						intended function.
					</li>
					<li>
						✅ Consider uninstalling – If the behavior seems unnecessary or suspicious,
						removing the app may be the safest choice.
					</li>
				</ul>
				<h3 className="text-2xl font-semibold mt-4">Threat Levels and How to Respond</h3>
				<h4 className="text-xl font-semibold mt-4">Level One: Filenames</h4>
				<p className="text-lg leading-relaxed">
					Many requests include filenames—this is often normal, especially for cloud
					services and backup tools.
				</p>
				<p className="text-lg leading-relaxed">
					<strong>Action:</strong> If an application is accessing particularly sensitive
					files (e.g., tax documents, passwords, work projects), investigate further. If
					the request seems unnecessary, consider uninstalling the application.
				</p>
				<h4 className="text-xl font-semibold mt-4">Level Two: Timestamps</h4>
				<p className="text-lg leading-relaxed">
					Timestamps track when files, actions, or events occur.
				</p>
				<p className="text-lg leading-relaxed">
					<strong>Action:</strong> If an application is sending timestamps linked to
					sensitive actions (e.g., login attempts, work schedules), check if it's
					necessary. If not, restrict its access.
				</p>
				<h4 className="text-xl font-semibold mt-4">Level Three: Locations</h4>
				<p className="text-lg leading-relaxed">
					Some apps request location data for legitimate reasons, like maps or weather
					services, but others may track your whereabouts unnecessarily.
				</p>
				<p className="text-lg leading-relaxed">
					<strong>Action:</strong> Review the app's permissions and disable location
					access if it doesn't need it.
				</p>
				<h4 className="text-xl font-semibold mt-4">Level Four: Clipboard Data</h4>
				<p className="text-lg leading-relaxed">
					Your clipboard may contain passwords, addresses, or other private data.
				</p>
				<p className="text-lg leading-relaxed">
					<strong>Action:</strong> If an app is frequently accessing clipboard data
					without a clear reason, it could be logging your information. Disable clipboard
					access or remove the app.
				</p>
				<h4 className="text-xl font-semibold mt-4">Level Five: Environment Variables</h4>
				<p className="text-lg leading-relaxed">
					These store system and user-specific settings, including API keys, session
					tokens, and system paths. If you are a non-technical user, you probably don't
					have to worry about this happening.
				</p>
				<p className="text-lg leading-relaxed">
					<strong>Action:</strong> If an application is accessing sensitive environment
					variables, it could be a major security risk. Immediately restrict its access
					and consider uninstalling the app.
				</p>
				<h3 className="text-2xl font-semibold mt-4">Final Steps</h3>
				<ul className="list-disc list-inside text-lg leading-relaxed">
					<li>If in doubt, block the request and investigate the app.</li>
					<li>Regularly review permissions for apps you install.</li>
					<li>Keep your software updated to prevent security vulnerabilities.</li>
				</ul>
				<p className="text-lg leading-relaxed">
					By following these steps, you ensure that your data stays in your control and
					your device remains secure.
				</p>
			</div>
		</div>
	)
}
