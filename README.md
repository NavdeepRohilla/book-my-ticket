# Book My Ticket

This repo now includes a completed backend for the assignment inside [`backend/`](./backend).

## Backend Setup

```bash
cd backend
npm install
npm start
```

The server runs on `http://localhost:8080` by default.

Frontend can be opened in either of these ways:

- Open [index.html](./index.html) with Live Server
- Or open `http://localhost:8080/app` after starting the backend

## Environment

Use the existing [`backend/.env`](./backend/.env) file. The backend currently uses:

```env
PORT=8080
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
```

No external database is required for this implementation. Data is stored locally in:

- `backend/data/users.json`
- `backend/data/bookings.json`

## Implemented Features

- User registration with hashed passwords
- User login with JWT token generation
- Auth middleware for protected endpoints
- Mocked movie data
- Protected seat booking
- Duplicate seat booking prevention
- Booking association with the logged-in user
- Legacy starter endpoints preserved:
  - `GET /seats`
  - `PUT /:id/:name`

## API Flow

### 1. Register

`POST /auth/register`

```json
{
  "name": "Navdeep",
  "email": "navdeep@example.com",
  "password": "secret123"
}
```

### 2. Login

`POST /auth/login`

```json
{
  "email": "navdeep@example.com",
  "password": "secret123"
}
```

Use the returned token as:

```http
Authorization: Bearer <token>
```

### 3. View Mock Movies

`GET /movies`

### 4. View Seats

- `GET /seats` for the default movie
- `GET /movies/:movieId/seats` for a specific movie

### 5. Book a Seat

`POST /bookings`

```json
{
  "movieId": "movie-1",
  "seatNumber": 4
}
```

### 6. View Logged-In User Bookings

`GET /bookings/me`

## Notes

- The legacy route `PUT /:id/:name` is still available for compatibility, but it now requires authentication and books a seat for the default movie using the logged-in user.
- The `:name` parameter is preserved to avoid breaking the starter route shape, but the booking is associated with the authenticated user stored in the token.
- The frontend uses `http://127.0.0.1:8080` as the backend when opened from Live Server on another port such as `5500`.
