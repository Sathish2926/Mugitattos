# Mugi Tattoo Backend

Express.js + MongoDB backend for a tattoo studio booking system.

## Features
- Booking API: create (public), update/reschedule (admin)
- Admin login with JWT (admin-only endpoints)
- Booking status management: pending, confirmed, reschedule
- Manual booking entry (call booking) by admin
- Confirmation via Email (Nodemailer) and WhatsApp (Twilio or WhatsApp Business Cloud)
- Input validation & sanitization

## Tech Stack
- Express.js, Mongoose (MongoDB)
- JWT (admin auth), bcryptjs
- Nodemailer, Twilio / WhatsApp Cloud API
- express-validator, mongo-sanitize, helmet, cors

## Project Structure
```
src/
  app.js
  server.js
  config/
    db.js
  controllers/
    authController.js
    bookingController.js
  middleware/
    auth.js
    errorHandler.js
    sanitize.js
    validate.js
  models/
    Admin.js
    Booking.js
  routes/
    authRoutes.js
    bookingRoutes.js
  services/
    emailService.js
    whatsappService.js
```

## Environment Variables
Copy `.env.example` to `.env` and fill in values.

## Quick Start
```bash
# from project root
npm install

# start dev server
npm run dev
```

Server runs on `http://localhost:3000`.

## Endpoints
- Public
  - POST /api/bookings
- Admin (JWT required)
  - POST /api/bookings/manual
  - PATCH /api/bookings/:id
  - POST /api/bookings/:id/reschedule
  - PATCH /api/bookings/:id/status
  - GET /api/bookings
  - GET /api/bookings/:id
  - POST /api/admin/register  (requires X-Setup-Token header)
  - POST /api/admin/login

### Admin Registration
Set `ADMIN_SETUP_TOKEN` in `.env`. Then:
```bash
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -H "X-Setup-Token: YOUR_SETUP_TOKEN" \
  -d '{"email":"admin@example.com","password":"StrongPass123"}'
```

### Admin Login
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"StrongPass123"}'
```
Response `{ "token": "..." }`. Use header `Authorization: Bearer <token>`.

## Email Configuration
Use custom SMTP:
- EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM

## WhatsApp Configuration
Choose one:
- Twilio: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM (e.g., +14155238886)
- WhatsApp Cloud: WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID

Ensure phone numbers are in E.164 format (e.g., +15551234567).

## MongoDB
Default URI: `mongodb://127.0.0.1:27017/mugitattoo`. Override with `MONGO_URI`.

## Health Check
GET `/health` returns `{ status: 'ok' }`.
