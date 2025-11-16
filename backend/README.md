# Apsara Report — Backend

This folder contains a minimal Express + MongoDB backend for the Apsara Report project.

Quick start (PowerShell):

```powershell
cd D:\DEV\apsara-report-project\backend
npm install
# copy .env.example to .env and edit MONGO_URI if needed
cp .env.example .env
npm run seed   # seeds sample data
npm run dev    # or `npm start` to run without nodemon
```

Endpoints:
- `GET /api/customers` — list customers
- `POST /api/customers` — create customer (body: name, email, phone, address)
- `GET /api/customers/:id` — get customer with repairs
- `PUT /api/customers/:id` — update
- `DELETE /api/customers/:id` — delete
- `POST /api/customers/:id/repairs` — add repair (body: deviceType, repairDetails, status)

The `qrCode` field contains a data URL image generated using the `qrcode` package.
