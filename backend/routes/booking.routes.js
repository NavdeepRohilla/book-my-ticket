import express from "express";
import {
  bookSeat,
  getMyBookings,
  getSeats,
  legacyBookSeat,
  listMovies,
} from "../controllers/booking.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/movies", listMovies);
router.get("/movies/:movieId/seats", getSeats);
router.get("/seats", getSeats);
router.get("/bookings/me", requireAuth, getMyBookings);
router.post("/bookings", requireAuth, bookSeat);
router.put("/:id/:name", requireAuth, legacyBookSeat);

export default router;
