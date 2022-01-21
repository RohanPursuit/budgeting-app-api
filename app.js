import express from "express"
import cors from "cors"
import budget from "./controllers/budgetController.js"


const app = express()

app.use(cors())
app.use(express.json())
app.use("/budget", budget)

app.get("*", (request, response) => {
    console.log("All other requests")
    response.send("All other requests")
})

export default app
