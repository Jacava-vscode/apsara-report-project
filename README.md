# Apsara Report Project

This repository is a scaffold for the Apsara Report full-stack application (minimal working example).

Folders:
- `backend/` — Express + MongoDB API (customers, repair history, QR generation)
- `frontend/` — Vite + React minimal UI that consumes the backend

Quick run (PowerShell):

Backend
```powershell
cd D:\DEV\apsara-report-project\backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Frontend
```powershell
cd D:\DEV\apsara-report-project\frontend
npm install
npm run dev
```
# apsara-report-project