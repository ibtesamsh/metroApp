import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Redis from "ioredis";
import connectDb from "./config/db.js";
import router from "./routes/routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

redis.on("connect", () => console.log("Redis connected successfully"));
redis.on("error", (err) => console.error("Redis error:", err.message));

// Lock CORS to the actual frontend origin(s) instead of allowing any origin.
// Set FRONTEND_URL in .env, comma-separate for multiple origins.
const allowedOrigins = (
  process.env.FRONTEND_URL || "http://localhost:5173"
).split(",");
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

app.get("/", (_req, res) => res.send("Metro API is running."));
app.use("/api", router);

// 404 fallback
app.use((_req, res) =>
  res.status(404).json({ success: false, message: "Route not found." }),
);

app.listen(PORT, "192.168.0.188", () =>
  console.log(`Server is running on port ${PORT}`),
);

// Sweep expired tickets once a minute. Lives here (single entrypoint)
// instead of inside a controller module, so it can't accidentally run
// more than once if that module is ever imported elsewhere.
import { expireStaleTickets } from "./controllers/ticketController.js";
setInterval(expireStaleTickets, 60 * 1000);
