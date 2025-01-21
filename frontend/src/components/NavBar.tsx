import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { Bell, HelpCircle, LayoutDashboard, Moon, Sun } from "lucide-react"
import { usePageName } from "@/hooks/usePageName"
import { useTheme } from "next-themes"

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
	const { theme, setTheme } = useTheme()

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
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						className="text-gray-300 hover:text-orange-500 hover:bg-glow"
					>
						<Moon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Sun className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					</Button>
				</div>
			</div>
		</nav>
	)
}

export default NavBar
