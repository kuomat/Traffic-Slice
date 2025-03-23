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
<<<<<<< HEAD
		return { pageName: "About" }
=======
		return { pageName: ""}
>>>>>>> origin/akash2
	}

	return { pageName: pathname }
}

export { usePageName }
