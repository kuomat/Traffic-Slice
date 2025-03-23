import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { Bell, HelpCircle, LayoutDashboard, Moon, Sun } from "lucide-react"
import { usePageName } from "@/hooks/usePageName"

const NavItem = ({
	href,
	icon,
	children
}: {
	href: string
	icon: React.ReactNode
	children: React.ReactNode
}) => {
	return (
		<Link to={href}>
			<Button variant="ghost" className="text-gray-300 hover:text-orange-500 hover:bg-glow">
				{icon}
				{children}
			</Button>
		</Link>
	)
}

const NavBar = () => {
	const { pageName } = usePageName()

	return (
		<nav className="bg-gray-800 p-4">
			<div className="flex items-center justify-between">
				<div className="text-2xl font-bold text-orange-500">{pageName}</div>
				<div className="flex items-center space-x-4">
					<NavItem href="/" icon={<LayoutDashboard />}>
						Dashboard
					</NavItem>
					<NavItem href="/help" icon={<HelpCircle />}>
						Help
					</NavItem>
					<NavItem href="/alerts" icon={<Bell />}>
						Alert List
					</NavItem>
					<NavItem href="/about" icon={<HelpCircle />}>
						About
					</NavItem>
				</div>
			</div>
		</nav>
	)
}

export default NavBar
