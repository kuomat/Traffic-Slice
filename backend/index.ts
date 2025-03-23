import express from "express"
import "dotenv/config"
import { AlertFilter, AnalyticsFilter, dbService } from "./database"
import { AlertFilterSchema, AnalyticsFilterSchema } from "./Types"
import cors from "cors"

const app = express()

const port = process.env.PORT || 8900

// Add JSON parsing middleware
app.use(express.json())
app.use(cors())

// Routes
app.get("/api/alerts", async (req, res) => {
	try {
		const filter: AlertFilter = AlertFilterSchema.parse(req.query)

		// Fetch alerts with pagination and notable alerts filtering
		const alerts = await dbService.getAlerts(filter)
		res.json(alerts)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Failed to fetch alerts" })
	}
})

app.get("/api/analytics/alerts", async (req, res) => {
	try {
		// Parse the filter from query params
		const filter: AnalyticsFilter = AnalyticsFilterSchema.parse(req.query)

		// Fetch analytics data with grouping and filtering
		const data = await dbService.getAlertAnalytics(filter)
		res.json(data)
	} catch (error) {
		console.error("Analytics API error:", error)
		res.status(500).json({ error: "Failed to fetch alert analytics" })
	}
})

app.get("/api/applications", async (req, res) => {
	try {
		const applications = await dbService.listApplications()
		res.json(applications)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Failed to fetch applications" })
	}
})

app.get("/api/destinations", async (req, res) => {
	try {
		const destinations = await dbService.listDestinations()
		res.json(destinations)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Failed to fetch destinations" })
	}
})

app.get("/api/alert-types", async (req, res) => {
	try {
		const types = await dbService.listAlertTypes()
		res.json(types)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Failed to fetch alert types" })
	}
})

// Debugging endpoint to get raw alert counts
app.get("/api/debug/alerts/count", async (req, res) => {
	try {
		const count = await dbService.getTotalAlertCount()
		res.json({ count })
	} catch (error) {
		console.error("Debug endpoint error:", error)
		res.status(500).json({ error: "Failed to get alert count" })
	}
})

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`)
})

export default app
