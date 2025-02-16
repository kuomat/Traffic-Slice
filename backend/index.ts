import express from "express"
import "dotenv/config"
import { AlertFilter, dbService } from "./database"
import { AlertFilterSchema } from "./Types"
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
		// console.log(filter)
		const alerts = await dbService.getAlerts(filter)
		res.json(alerts)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Failed to fetch alerts" })
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

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`)
})

export default app
