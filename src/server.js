import express from "express";
import "dotenv/config";
import { connetDB } from "./config/db.js";
import rateLimiterMiddleware from "./middleware/rateLimiter.js";
import router from "./routes/transaction.router.js";
const app = express();

app.use(rateLimiterMiddleware) // Apply rate limiting middleware to all routes
app.use(express.json()); // Middleware to parse JSON bodies
const PORT = process.env.PORT || 5001;


app.use("/api/transactions", router)

connetDB().then(() => {
  app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  })
})