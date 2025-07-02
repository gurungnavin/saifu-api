import express from "express";
import "dotenv/config";
import { connetDB } from "./config/db.js";
import rateLimiterMiddleware from "./middleware/rateLimiter.js";
import router from "./routes/transaction.router.js";
import job from "./config/cron.js"

const app = express();

if (process.env.NODE_ENV === "production") job.start(); // Start cron job only in production environment

//middleware
app.use(rateLimiterMiddleware) // Apply rate limiting middleware to all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Port configuration
const PORT = process.env.PORT || 5001;

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
})

app.use("/api/transactions", router)

connetDB().then(() => {
  app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  })
})