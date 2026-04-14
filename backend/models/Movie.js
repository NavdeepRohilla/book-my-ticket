const mockMovies = [
  {
    id: "movie-1",
    title: "Dhurandhar The Revenge",
    language: "Hindi",
    durationMinutes: 146,
    seatCount: 20,
  },
  {
    id: "movie-2",
    title: "Midnight Express Lane",
    language: "English",
    durationMinutes: 118,
    seatCount: 16,
  },
];

export const getMovies = () => mockMovies;

export const getMovieById = (movieId) =>
  mockMovies.find((movie) => movie.id === movieId);

export const getDefaultMovie = () => mockMovies[0];
