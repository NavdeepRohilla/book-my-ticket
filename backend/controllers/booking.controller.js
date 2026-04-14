import {
  createBooking,
  findBookingsByMovie,
  findBookingsByUser,
} from "../models/Booking.js";
import { getDefaultMovie, getMovieById, getMovies } from "../models/Movie.js";

const buildSeatMap = (movie, bookings) => {
  const bookingBySeat = new Map(
    bookings.map((booking) => [Number(booking.seatNumber), booking])
  );

  return Array.from({ length: movie.seatCount }, (_, index) => {
    const seatNumber = index + 1;
    const booking = bookingBySeat.get(seatNumber);

    return {
      id: seatNumber,
      seatNumber,
      isbooked: booking ? 1 : 0,
      isBooked: Boolean(booking),
      name: booking?.userName ?? null,
      userId: booking?.userId ?? null,
      movieId: movie.id,
    };
  });
};

const parseSeatNumber = (value) => {
  const seatNumber = Number(value);
  return Number.isInteger(seatNumber) ? seatNumber : NaN;
};

export const listMovies = async (_req, res) => {
  const movies = await Promise.all(
    getMovies().map(async (movie) => {
      const bookings = await findBookingsByMovie(movie.id);

      return {
        ...movie,
        bookedSeats: bookings.length,
        availableSeats: movie.seatCount - bookings.length,
      };
    })
  );

  return res.status(200).json(movies);
};

export const getSeats = async (req, res) => {
  const movieId = req.params.movieId || getDefaultMovie().id;
  const movie = getMovieById(movieId);

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const bookings = await findBookingsByMovie(movie.id);
  return res.status(200).json(buildSeatMap(movie, bookings));
};

export const bookSeat = async (req, res) => {
  const { movieId, seatNumber } = req.body ?? {};
  const movie = getMovieById(movieId);

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const parsedSeatNumber = parseSeatNumber(seatNumber);

  if (Number.isNaN(parsedSeatNumber)) {
    return res.status(400).json({ message: "Valid seatNumber is required" });
  }

  if (parsedSeatNumber < 1 || parsedSeatNumber > movie.seatCount) {
    return res.status(400).json({ message: "Seat number out of range" });
  }

  const { booking, existingBooking } = await createBooking({
    movieId: movie.id,
    movieTitle: movie.title,
    seatNumber: parsedSeatNumber,
    userId: req.user.id,
    userName: req.user.name,
  });

  if (existingBooking) {
    return res.status(409).json({
      message: "Seat already booked",
      booking: existingBooking,
    });
  }

  return res.status(201).json({
    message: "Seat booked successfully",
    booking,
  });
};

export const getMyBookings = async (req, res) => {
  const bookings = await findBookingsByUser(req.user.id);
  return res.status(200).json(bookings);
};

export const legacyBookSeat = async (req, res) => {
  const defaultMovie = getDefaultMovie();
  req.body = {
    movieId: defaultMovie.id,
    seatNumber: req.params.id,
  };

  return bookSeat(req, res);
};
