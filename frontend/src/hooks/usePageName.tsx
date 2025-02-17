import { useLocation } from "@tanstack/react-router"

const usePageName = (): { pageName: string } => {
	const { pathname } = useLocation()

	if (pathname === "/") {
		return { pageName: "Dashboard" }
	} else if (pathname === "/help") {
		return { pageName: "" }
	} else if (pathname === "/alerts") {
		return { pageName: "Alert List" }
	} else if (pathname === "/about") {
		return { pageName: ""}
	}

	return { pageName: pathname }
}

export { usePageName }
