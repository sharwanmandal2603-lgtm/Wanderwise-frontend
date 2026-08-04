# WanderWise

WanderWise is a full-stack trip planning app. Users can plan trips, build day-by-day
itineraries, track a packing checklist, manage a trip budget, invite collaborators, and
(for admins) manage every user and trip on the platform from a dedicated admin panel.

The project is split into two independent apps:

```
wander-wise/
├── backend/    Express + MongoDB REST API
└── frontend/   React (Vite) single-page app
```

---

## Features

- **Auth** — register/login with JWT-based sessions.
- **Trips** — create, edit, delete trips with dates, destinations, and a budget.
- **Expenses** — log expenses against a trip and track spend vs. budget.
- **Collaborators** — invite other users to a trip by email; they accept via a link.
- **Itineraries** — day-by-day plans with activities, times, and notes, scoped per trip.
- **Baggage / packing list** — a checklist of items per trip, with pack/unpack toggling.
- **Dashboard** — an overview of your trips, upcoming trip, and budget at a glance.
- **Admin Panel** (`/dashboard/admin`, admins only) — platform-wide stats, user
  management (promote/demote/delete accounts), and trip oversight (view/delete any trip).

---

## Tech stack

**Backend:** Node.js, Express 5, MongoDB/Mongoose, JWT auth, bcrypt, express-validator,
nodemailer (for collaborator invite emails), [dotenvx](https://dotenvx.com) for env
management.

**Frontend:** React 19, Vite, React Router, React Hook Form + Zod, Tailwind CSS,
shadcn/ui (Radix primitives), Axios, Sonner (toasts).

---

## Prerequisites

- Node.js 20+ (Node 22 recommended)
- A MongoDB database (local, or a free cluster on MongoDB Atlas)
- npm

---

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create a `backend/.env` file (this is **not** included in the project — it holds secrets):

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_KEY=some_long_random_secret_string
JWT_EXPIRES_IN=7d

# Used for collaborator invite emails — optional in local dev,
# but required for the "Invite Collaborator" feature to actually send mail.
SMTP_SERVICE=gmail
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_smtp_app_password

BASE_URL=http://localhost:5173
```

Start the API:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start        # plain node, no auto-restart
```

You should see:

```
Server is running on port 3000
MongoDB connected successfully
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create a `frontend/.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000
```

(Match the port to whatever `PORT` you set in the backend `.env`.)

Start the dev server:

```bash
npm run dev
```

Vite will print the local URL (usually `http://localhost:5173`, but it may pick a
different port like `5174` if `5173` is already in use — that's fine, the backend's CORS
config allows any `localhost`/`127.0.0.1` port in development).

---

## Creating an admin account

There is no sign-up flow for admins — every account registers as a regular `user` by
design. To promote an account to `admin`, run this from `backend/`, after that user has
already registered normally through the site:

```bash
npm run make-admin -- someone@example.com
```

**Important:** after promoting an account, that user must **log out and log back in**.
The role is baked into the JWT at login time, so an already-open session won't pick up
the change until a fresh token is issued.

Once logged in as an admin, you'll see an **"Admin"** link in the navbar and an
**"Admin Panel"** card on the dashboard, both linking to `/dashboard/admin` — a single
page with three tabs: **Overview**, **Users**, and **Trips**.

### Resetting a password

There's no "Forgot Password" flow yet. If you (or a test user) lose a password, reset it
directly from `backend/`:

```bash
npm run reset-password -- someone@example.com NewPassword123
```

(New password must be at least 8 characters.)

---

## Project structure

### Backend (`backend/`)

```
config/        DB connection, JWT helpers
handlers/      Express routers (one per resource: auth, users, trips, baggage,
               itineraries, admin)
services/      Business logic — DB queries, validation logic that needs the DB
validators/    express-validator rule chains per resource
models/        Mongoose schemas (User, Trip, Baggage, Itinerary)
middlewares/   authMiddleware (JWT verification), adminMiddleware (role check),
               errorMiddleware (centralized error responses)
errors/        Custom error classes (NotFoundError, ValidationError, ConflictError,
               UnauthorizedError, ForbiddenError) — each carries an HTTP status code
scripts/       One-off CLI scripts: make-admin.js, reset-password.js
```

### Frontend (`frontend/src/`)

```
pages/                 Route-level components, grouped by feature
  trips/, baggage/, itinerary/, admin/
components/
  shared/               Reusable app components (forms, navbar, buttons)
  landingComponents/    Public marketing page sections (Hero, Features, Footer, etc.)
  ui/                   shadcn/ui primitives (Button, Card, Dialog, etc.)
layouts/                AppLayout — navbar + footer wrapper for authenticated pages
context/, hooks/        AuthContext/useAuth (JWT + role), useApi (data fetching)
api/axios.js            Configured Axios instance (attaches JWT to every request)
```

---

## API overview

All endpoints are prefixed by the backend's base URL (e.g. `http://localhost:3000`).
Every route except `/auth/login` and `/auth/register` requires an
`Authorization: Bearer <token>` header.

| Resource | Base path | Notes |
|---|---|---|
| Auth | `/auth/register`, `/auth/login` | Public |
| Trips | `/trips` | Scoped to the logged-in user's own trips + collaborations |
| Baggage | `/:tripId/baggages` | Scoped to a specific trip |
| Itineraries | `/:tripId/itineraries` | Scoped to a specific trip |
| Admin | `/admin/stats`, `/admin/users`, `/admin/trips` | Admin role required (403 otherwise) |
| Users (legacy) | `/users` | Admin role required |

---

## Troubleshooting

**"Network Error" on login, or requests failing outright**
The frontend can't reach the backend at all. Check:
- The backend terminal is still running and shows no crash after "MongoDB connected
  successfully."
- `frontend/.env`'s `VITE_API_BASE_URL` port matches the backend's actual `PORT`.
- Windows Firewall isn't blocking Node from listening on that port (it sometimes prompts
  the first time a Node server starts — make sure that wasn't dismissed/blocked).

**CORS errors in the browser console**
The backend only allows `localhost`/`127.0.0.1` origins in development. If you're
accessing the frontend via a different hostname (e.g. a LAN IP on your phone), you'll
need to add that origin to the `origin` check in `backend/index.js` before it will work.

**Admin link/panel not showing after running `make-admin`**
You need to log out and log back in — see the note above. The role lives in the JWT, not
just the database, and a token issued before the promotion won't have it.

**`dotenvx: command not found` / `'dotenvx' is not recognized`**
You ran `npm run dev` before `npm install` finished (or `npm install` was never run) in
that folder — `dotenvx` is a dependency, not a global tool. Run `npm install` first.

---

## Deploying to production

A few things in this codebase are intentionally relaxed for local development and
**should be tightened before deploying**:

- **CORS** (`backend/index.js`) currently allows any `localhost`/`127.0.0.1` origin.
  Replace this with an explicit allowlist of your production frontend's domain.
- **Environment secrets** — never commit `.env` files. Rotate any credentials that were
  ever shared or committed accidentally (Mongo URI, JWT key, SMTP credentials).
- **JWT expiry** — review `JWT_EXPIRES_IN`; a long-lived token means a compromised token
  stays valid longer.
