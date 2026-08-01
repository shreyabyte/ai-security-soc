// Base URL of the FastAPI backend.
// Set VITE_API_URL in a .env file to override (see .env.example).
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:8000';

// How often (ms) the dashboard polls the backend for fresh data.
export const POLL_INTERVAL_MS = 3000;
