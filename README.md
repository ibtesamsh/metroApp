# Metro Ticketing — Refactored

## What changed

### Backend
- **Removed duplicate/conflicting code**: `ticketSource.js`, `ticketDestination.js`, and `helper/data.js` are gone.
  They were a second, half-finished implementation of journey validation that used a different
  `metroData` shape and wrote an invalid ticket status (`"In-journey"`, not in the schema enum) —
  every call to `/validate-source` would have crashed on save.
- **One `metroData.js`**, in `backend/helper/`. The frontend has its own copy (`frontend/src/metroData.js`)
  for populating dropdowns — keep the two in sync if you ever add/remove stations.
- **Interchange-aware journeys**: `backend/helper/metroUtils.js` adds `buildTicketRoute()`, which walks a ticket's
  full path (source → via → destination) leg by leg. `startJourney`/`completeJourney` now validate against that
  full path instead of requiring a single line to contain both source and destination — the old code made it
  impossible to ever start or complete a journey on any ticket that crossed lines.
- **8 controllers → 3**: `authController.js` (register/login/logout), `ticketController.js` (buy/list/verify/expire),
  `journeyController.js` (start/complete).
- **Fixed**: password hash no longer leaked in the register response or attached to `req.user`; `.sort({ date: -1 })`
  changed to `.sort({ issuedAt: -1 })` (the schema never had a `date` field, so the old sort was a no-op);
  CORS is now restricted to `FRONTEND_URL` instead of wide open; added ownership checks so one user can't
  start/complete/verify another user's ticket; the expiry sweep is scheduled once from `server.js` instead of
  inside a controller module.
- Route `GET /api/my-ticket` renamed to `GET /api/my-tickets` (was inconsistently named vs. the plural resource).

### Frontend
- **Real routes** (`/`, `/tickets`, `/start-journey`, `/complete-journey`, `/verify-ticket`) via nested
  `react-router` routes instead of a local `currentView` string — you get working back/forward, shareable
  URLs, and a `ProtectedRoute` guard instead of manual `token` checks scattered per-page.
- **Fixed the login bug**: `if (token === true)` never fired because `localStorage.getItem` returns a string
  or `null`, never boolean `true`. It's now `if (token)`.
- **Removed dead code**: `PaymentPage.jsx` posted to `/api/tickets`, a route that never existed.
- A small shared UI kit (`src/components/ui/`) — `Button`, `Field`/`TextInput`/`Select`, `Card`, `Alert`,
  `StatusBadge`, icons — so every screen shares one dark, violet-accented visual language instead of each
  page hand-rolling its own Tailwind classes.
- Booking no longer asks the user to pick a line first — you just pick source and destination and the backend
  resolves the route (including interchange) and price.
- **Interactive metro map on the Book Ticket page** (`src/components/ui/MetroMap.jsx`): tap a station to set
  it as your source, tap another for your destination. Stations that aren't reachable from your source are
  grayed out and un-clickable — so the "No valid route exists between the selected stations" error from the
  backend can no longer happen via the map, because you physically can't select an invalid pair.
  - `src/stationPositions.js` holds a hand-placed schematic layout (not geographic) for all 49 stations —
    straight lines, clearly separated, mirrors the shape of the real network.
  - `src/metroGraph.js` builds a client-side adjacency graph from `metroData.js` purely for map UX: which
    stations are reachable from a given source, and a shortest-hop path to draw as a preview line. This is
    *not* authoritative — the backend's `planJourney()` independently computes the real route and price.
  - **Why some stations gray out no matter what you pick**: `Line-5` (Thane–Bhiwandi–Kalyan) doesn't share
    any station with the other seven lines in the sample data, so it's a genuinely disconnected island on
    the network graph — that's very likely what was producing the confusing error before. It's drawn
    separately on the map in a muted color so that's visually obvious now. If that's not intentional, add a
    shared station connecting it to the rest of the network in both `metroData.js` files.
  - The old line/station dropdowns are still there below the map (now filtered to only show reachable
    destinations) as an accessible, keyboard/screen-reader-friendly fallback — they stay in sync with the map.

## Razorpay payments (new)

A single env var, `RAZORPAY_PAYMENT`, switches the whole booking flow — backend and frontend both respect it,
and the backend enforces it so the switch can't be bypassed by calling the old endpoint directly.

- **`RAZORPAY_PAYMENT=false`** (or unset) — unchanged from before: `POST /buy-ticket` books a ticket
  immediately, no payment step.
- **`RAZORPAY_PAYMENT=true`** — `POST /buy-ticket` now returns a 400 ("Direct booking is disabled..."). The
  frontend instead calls `POST /payment/create-order` (creates a Razorpay order for the computed price),
  opens Razorpay's checkout modal, and on success calls `POST /payment/verify`, which **re-derives the
  payment signature server-side from `RAZORPAY_KEY_SECRET` and only then issues the ticket** — the client's
  claim that payment succeeded is never trusted on its own.

### What's new

**Backend**
- `backend/controllers/paymentController.js` — `getPaymentConfig` (tells the frontend which flow to use and
  hands over the public `key_id`, never the secret), `createPaymentOrder`, `verifyPaymentAndBook`.
- `backend/helper/issueTicket.js` — the actual "validate route, write the ticket, refresh the cache" logic,
  pulled out of `ticketController.js` so both the free and paid flows call the exact same code instead of
  two copies that could drift apart.
- `backend/models/ticket.model.js` — added `razorpayOrderId` / `razorpayPaymentId` (both `null` on
  free-flow tickets).
- New routes: `GET /payment-config`, `POST /payment/create-order`, `POST /payment/verify` (all behind
  `authToken`, same as everything else).

**Frontend**
- `frontend/src/razorpay.js` — loads Razorpay's `checkout.js` script on demand (only when payments are
  actually enabled, not on every page load).
- `frontend/src/pages/BookTicket.jsx` — fetches `/payment-config` on mount; the "Buy ticket" button becomes
  "Pay & book ticket" and opens the Razorpay modal when enabled, otherwise behaves exactly as before.

### Setup

1. `cd backend && npm install razorpay` (not yet in your `package.json` — everything else used here was
   already a dependency).
2. In `backend/.env`, set:
   ```
   RAZORPAY_PAYMENT=true
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_test_key_secret
   ```
3. Restart the backend. No frontend env changes needed — it reads the mode from `/payment-config` at runtime.
4. Test with Razorpay's test cards (e.g. `4111 1111 1111 1111`, any future expiry, any CVV) — see
   [Razorpay's test mode docs](https://razorpay.com/docs/payments/payments/test-card-upi-details/) for the
   full list including UPI/netbanking test flows.
5. Flip `RAZORPAY_PAYMENT=false` any time to fall back to free/direct booking — no code or route changes
   needed, just restart the backend.

### Notes
- If a payment succeeds but ticket creation then fails (e.g. a DB blip right after payment), the API responds
  with the `razorpayPaymentId` so you can look it up and resolve it manually — Razorpay doesn't offer an
  automatic refund-on-ticket-failure hook here, so this is worth monitoring/logging in production rather than
  treated as fully self-healing.
- `verifyPaymentAndBook` re-runs `planJourney` after verifying the signature rather than trusting the price
  quoted at order-creation time, in case station data changes between the two calls.

## Wiring it up

1. Copy `backend/.env.example` → `backend/.env` and fill in `MONGODB_URI`, `TOKEN_SECRET_KEY`, `FRONTEND_URL`.
2. Copy `frontend/.env.example` → `frontend/.env` if your API isn't on `http://localhost:8000/api`.
3. Your existing `package.json`, `vite.config.js`, `index.css`/Tailwind setup, and `main.jsx` weren't in what
   you shared, so they aren't included here — drop these files into your existing project structure
   (`backend/*` and `frontend/src/*`) rather than starting a fresh install.
4. `frontend/src/pages/MyTickets.jsx` no longer uses `react-toastify` (errors show inline instead) — you can
   remove that dependency if nothing else in your app uses it, or leave it installed, it won't conflict.

## Still worth doing

- `planJourney()` only resolves a single interchange (source line → common station → destination line).
  That covers every real route on this network today; if you add a line that requires two interchanges,
  extend the search in `metroUtils.js`.
- Consider moving the JWT out of `localStorage` (XSS-exposed) into an `httpOnly` cookie now that the backend
  no longer needs to do both — currently only the header-based token is actually used.
