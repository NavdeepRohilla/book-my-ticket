import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import { initializeStore } from "./config/db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, "../index.html");

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.status(200).json({
      message: "Book My Ticket backend is running",
      endpoints: {
        register: "POST /auth/register",
        login: "POST /auth/login",
        app: "GET /app",
        movies: "GET /movies",
        seats: "GET /seats or GET /movies/:movieId/seats",
        bookSeat: "POST /bookings",
        myBookings: "GET /bookings/me",
      },
    });
  });

  app.get("/app", (_req, res) => {
    res.sendFile(frontendPath);
  });

  app.use("/auth", authRoutes);
  app.use("/", bookingRoutes);

  app.use((req, res) => {
    res
      .status(404)
      .json({ message: `Route ${req.method} ${req.path} not found` });
  });

  return app;
};

export const startServer = async (port = process.env.PORT || 8080) => {
  await initializeStore();
  const app = createApp();

  return app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
  });
};

const currentFilePath = fileURLToPath(import.meta.url);
const isDirectExecution = process.argv[1] === currentFilePath;

if (isDirectExecution) {
  startServer().catch((error) => {
    console.error("Failed to start backend server", error);
    process.exit(1);
  });
}

export default createApp;
