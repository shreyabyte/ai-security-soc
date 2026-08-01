# AI SOC Dashboard

## Problem Statement
Modern organizations generate large volumes of security logs and system events every minute, but monitoring them manually is slow, error-prone, and often leads to missed alerts. Security teams need a centralized and intelligent way to identify suspicious activity, monitor server health, and respond quickly to potential threats.

## Project Overview
AI SOC Dashboard is a full-stack security monitoring solution designed to simulate a Security Operations Center (SOC) environment. It collects logs, detects suspicious behavior, and displays real-time alerts and system insights through an interactive dashboard. The project combines a React-based frontend, a FastAPI backend, and a lightweight database to provide a practical and scalable monitoring experience.

## Key Features
- Real-time log visualization for system and security events
- Live alerting for suspicious activities such as repeated failed logins and high CPU usage
- Server health monitoring with status indicators
- Interactive charts for performance and event trends
- Lightweight architecture suitable for demos, learning, and future expansion

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Recharts
- Backend: FastAPI, Python
- Database: SQLite
- AI / Detection Logic: Rule-based anomaly detection for security events and system health monitoring
- Other Tools: REST APIs, CORS support, JSON-based data exchange

## Team Members and Contributions
- Member 1 – Frontend Development & Integration

Designed and developed the AI SOC dashboard UI
Improved user experience and dashboard layout
Integrated frontend with backend APIs
Implemented data visualization and responsive layouts

- Member 2 – Backend Development & Detection Engine

Developed FastAPI backend and REST APIs
Designed and managed the database schema and API endpoints
Implemented log generation and threat detection logic
Built alert generation, server monitoring, and backend testing

## Demo

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

## Future Scope / Improvements
- Integrate with real SIEM tools and cloud log sources
- Add authentication and role-based access control
- Introduce machine learning-based anomaly detection
- Add email, SMS, or Slack notifications for critical incidents
- Expand analytics with advanced threat correlation and reporting



