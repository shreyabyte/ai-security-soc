# AI SOC Dashboard — Merged Project

Your frontend (rich UI) + your friend's backend (FastAPI + SQLite), wired together.

## What changed

- **Backend**: untouched — still the FastAPI app your friend built (`/logs`, `/alerts`, `/servers`), including the background log generator that simulates live traffic every 3s.
- **Frontend**: your original UI, but:
  - `src/services/api.ts` now calls the real backend instead of returning mock arrays.
  - `src/services/adapters.ts` is new — it maps the backend's simple data shapes into your frontend's richer `Log` / `Alert` / `Server` types, and derives dashboard KPIs/charts from real logs + alerts (since the backend doesn't pre-compute those).
  - `src/services/websocket.ts` used to fake a WebSocket with random data. It now polls `GET /logs` every 3s for real new events, but keeps the exact same interface so nothing else had to change.
  - Removed unused Replit-monorepo scaffolding (workspace packages, Postgres/Drizzle db, Orval codegen) that your frontend export included but never actually used — it was 100% mock data end to end.
  - The **AI Security Analyst is now wired to real data** too — see below.
- **Backend addition**: `ai_analyst.py` + two new endpoints, `GET /ai/summary` and `POST /ai/ask`. This is rule-based analysis over your real alerts/logs (no LLM, no API key needed) — it replaces the old hardcoded chat responses with answers that actually reflect what's in your database right now.

## AI Security Analyst

- `GET /ai/summary` — current focus, risk score, and recommended actions, derived from the most severe/recent real alert.
- `POST /ai/ask {question}` — simple keyword-routed answers (critical threats, blocking IPs, server/CPU status, recent logs) grounded in real DB data.
- This is **not** an LLM — it's honest rule-based logic, same idea as the old simulated version but backed by real data instead of canned text.
- To upgrade to a real LLM later: get a Gemini API key at https://aistudio.google.com/apikey, add it to `backend/.env` as `GEMINI_API_KEY`, and swap the body of `ai_analyst.ask()` for a call to the Gemini API (keep the same function signature so nothing else needs to change).

## Known gaps / honest limitations

- Backend doesn't track server memory/disk/network — the adapter derives stable placeholder values from CPU so the UI doesn't look broken. Real values would need the backend extended.
- **Threat Intelligence** page still uses mock data — the backend has no threat-intel feed at all, so there's nothing real to wire it to yet.
- Backend alert severities are only `critical`/`warning` (no `high`/`low`), so those buckets are always 0 in charts — cosmetic, not a bug.
- No auth on the backend — fine for a demo/hackathon, not production.

## How to run it

**1. Backend** (needs Python 3.10+):
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
This starts the API on `http://localhost:8000` and immediately starts generating fake log traffic in the background (so you'll see data right away).

**2. Frontend** (needs Node 18+):
```bash
cd frontend
npm install
npm run dev
```
This starts the dashboard on `http://localhost:3000`. It reads the backend URL from `.env` (`VITE_API_URL=http://localhost:8000` by default — already set).

Open `http://localhost:3000` — you should see live logs, alerts, and server health updating every few seconds, all coming from the real backend.

## Next steps (optional, if you have more time)

- **AI Analyst → real LLM**: see the "AI Security Analyst" section above — the endpoint is already in place, it just needs a Gemini key swapped in.
- **Threat Intelligence**: would need a real feed (even a free one like AbuseIPDB) to replace the mock data.
- **Server metrics**: extend backend `models.py`/`log_generator.py` to actually track memory/disk/network if you want real numbers instead of derived placeholders.
