import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import path from "path"
import EnvironmentPlugin from "vite-plugin-environment"

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		TanStackRouterVite(),
		EnvironmentPlugin({
			API_ENDPOINT: "http://localhost:8900"
		})
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src")
		}
	}
})
