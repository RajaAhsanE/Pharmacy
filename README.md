# Pharmacy Audio Analyzer Frontend

React frontend for the Pharmacy Audio Analyzer FastAPI backend.

## Setup

```bash
npm install
npm start
```

The app will run on `http://localhost:3000`

## Features

- **Login** — JWT authentication with 1-hour token expiry
- **Upload** — Upload multiple WAV audio files
- **Dashboard** — View and manage audio analysis results
- **Insights** — Generate and view cross-analysis insights
- **Auto-Polling** — Results refresh every 10s while processing

## API Integration

- Backend must be running on `http://localhost:8000`
- All requests include Bearer token from localStorage
- Auto-logout on 401 (token expired)

## Pages

- `/login` — Login page
- `/dashboard` — Main dashboard (protected)

## Components

- `src/api.js` — Axios instance with interceptors
- `src/pages/Login.jsx` — Login form
- `src/pages/Dashboard.jsx` — Results table + insights
- `src/App.js` — Router setup
