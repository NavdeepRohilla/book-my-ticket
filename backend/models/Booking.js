import crypto from "crypto";
import {
  readCollection,
  runExclusive,
  writeCollection,
} from "../config/db.js";

const BOOKINGS_COLLECTION = "bookings";

export const findBookingByMovieAndSeat = async (movieId, seatNumber) => {
  const bookings = await readCollection(BOOKINGS_COLLECTION);
  return bookings.find(
    (booking) =>
      booking.movieId === movieId && Number(booking.seatNumber) === seatNumber
  );
};

export const findBookingsByMovie = async (movieId) => {
  const bookings = await readCollection(BOOKINGS_COLLECTION);
  return bookings.filter((booking) => booking.movieId === movieId);
};

export const findBookingsByUser = async (userId) => {
  const bookings = await readCollection(BOOKINGS_COLLECTION);
  return bookings.filter((booking) => booking.userId === userId);
};

export const createBooking = async ({
  movieId,
  movieTitle,
  seatNumber,
  userId,
  userName,
}) =>
  runExclusive(async () => {
    const bookings = await readCollection(BOOKINGS_COLLECTION);

    const existingBooking = bookings.find(
      (booking) =>
        booking.movieId === movieId && Number(booking.seatNumber) === seatNumber
    );

    if (existingBooking) {
      return { booking: null, existingBooking };
    }

    const newBooking = {
      id: crypto.randomUUID(),
      movieId,
      movieTitle,
      seatNumber,
      userId,
      userName,
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    await writeCollection(BOOKINGS_COLLECTION, bookings);

    return { booking: newBooking, existingBooking: null };
  });
