# Email & WhatsApp Configuration & Troubleshooting Guide

## Overview

This guide covers debugging and fixing both email and WhatsApp integrations for your Mugi Tattoo booking system.

---

## EMAIL CONFIGURATION

### Issues Fixed

#### 1. **Incorrect SMTP Host** ✓
- **Problem**: Email host was set to `smtp.mailprovider.com` (placeholder)
- **Solution**: Changed to `smtp.gmail.com` to use Gmail's actual SMTP server
- **File**: `.env` - `EMAIL_HOST` variable

#### 2. **Silent Error Handling** ✓
- **Problem**: Email errors were caught but only logged as warnings
- **Solution**: Added detailed logging with prefixes: `[EMAIL SUCCESS]`, `[EMAIL ERROR]`, `[BOOKING]`
- **Files Updated**:
  - `src/services/emailService.js` - Added logging to all email functions
  - `src/controllers/bookingController.js` - Improved error tracking

#### 3. **Missing Email Verification** ✓
- **Problem**: No way to verify if email configuration actually works
- **Solution**: Added `verifyEmailConfig()` function that tests SMTP connection on startup
- **File**: `src/services/emailService.js`

#### 4. **No Test Endpoint** ✓
- **Problem**: Had to create bookings to test if emails work
- **Solution**: Added test endpoints to manually verify email configuration
- **File**: `src/routes/bookingRoutes.js`

### Email Test Endpoints

#### Check Configuration (GET)
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:3000/api/bookings/test/email-config
```

**Success Response**:
```json
{
  "status": "OK",
  "message": "Email configuration is valid and working",
  "details": {
    "host": "smtp.gmail.com",
    "user": "mugitattoos@gmail.com",
    "from": "Mugi Tattoo <mugitattoos@gmail.com>"
  }
}
```

#### Send Test Email (POST)
```bash
curl -X POST -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"recipientEmail":"test@example.com"}' \
  http://localhost:3000/api/bookings/test/send-test-email
```

**Success Response**:
```json
{
  "status": "SUCCESS",
  "message": "Test email sent successfully",
  "messageId": "<abc123@gmail.com>",
  "recipientEmail": "test@example.com"
}
```

### Email Troubleshooting

#### Startup Logs to Check
```
[STARTUP] Verifying email configuration...
[EMAIL SERVICE] Creating transporter for smtp.gmail.com:587 as mugitattoos@gmail.com
[EMAIL SERVICE] ✓ Email configuration verified successfully
```

If you see error instead:
```
[EMAIL SERVICE] ✗ Email configuration failed: [error message]
```

#### Common Email Issues

1. **"Invalid login" error**
   - Gmail account credentials might be wrong
   - Check if 2FA is enabled on Gmail account
   - App password may have expired
   - Current password: `yyxq utjl grsx cufo`

2. **"Connection timeout"**
   - Network connectivity issue
   - Firewall blocking SMTP port 587
   - Check if VPN is interfering

3. **"TLS required" error**
   - Port might be wrong
   - Should be 587 for TLS
   - 465 is for SSL

4. **Email not in Inbox**
   - Check Spam/Promotions folder
   - Gmail may flag promotional emails
   - Add mugitattoos@gmail.com to contacts

#### Email Configuration (.env)
```
EMAIL_HOST=smtp.gmail.com          # Must be correct
EMAIL_PORT=587                     # Must be 587 for TLS
EMAIL_USER=mugitattoos@gmail.com   # Gmail account
EMAIL_PASS=yyxq utjl grsx cufo     # App password (not regular password)
EMAIL_FROM=Mugi Tattoo <mugitattoos@gmail.com>
```

---

## WHATSAPP CONFIGURATION

### 🎯 Current Setup: **WhatsApp Business Cloud API** (FREE)

Since Twilio requires paid credentials, I've configured the system to use **WhatsApp Business Cloud API** which is free and integrated with Meta.

### Issues Fixed

#### 1. **Missing WhatsApp Verification** ✓
- **Problem**: No way to verify WhatsApp configuration
- **Solution**: Added `verifyWhatsAppConfig()` function
- **File**: `src/services/whatsappService.js`

#### 2. **Silent WhatsApp Errors** ✓
- **Problem**: WhatsApp send failures weren't logged clearly
- **Solution**: Added detailed logging: `[WHATSAPP SUCCESS]`, `[WHATSAPP ERROR]`, `[WHATSAPP BOOKING]`
- **Files Updated**:
  - `src/services/whatsappService.js` - Logging on all sends
  - `src/controllers/bookingController.js` - Error tracking

#### 3. **No Test Endpoints** ✓
- **Problem**: Couldn't test WhatsApp without creating bookings
- **Solution**: Added test endpoints for WhatsApp
- **File**: `src/routes/bookingRoutes.js`

### WhatsApp Test Endpoints

#### Check Configuration (GET)
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:3000/api/bookings/test/whatsapp-config
```

**Success Response**:
```json
{
  "status": "OK",
  "message": "WhatsApp configuration is valid and working (WhatsApp Business Cloud API)",
  "details": {
    "service": "WhatsApp Business Cloud API",
    "isTwilio": false,
    "isWhatsAppCloud": true,
    "phoneNumberId": "123456789012345"
  }
}
```

#### Send Test WhatsApp Message (POST)
```bash
curl -X POST -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"recipientPhone":"+919080719253"}' \
  http://localhost:3000/api/bookings/test/send-test-whatsapp
```

**Success Response**:
```json
{
  "status": "SUCCESS",
  "message": "Test WhatsApp message sent via Business Cloud API",
  "provider": "WhatsApp Business Cloud",
  "messageId": "wamid.xyz...",
  "recipientPhone": "+919080719253"
}
```

### WhatsApp Startup Verification

When server starts:
```
[STARTUP] Verifying WhatsApp configuration...
[WHATSAPP SERVICE] ✓ WhatsApp Business Cloud API verified successfully
[STARTUP] WhatsApp: Using WhatsApp Business Cloud API
```

### WhatsApp Troubleshooting

#### WhatsApp Business Cloud Setup Checklist

1. **Meta Business Account**
   - Must have registered Business Account
   - Set up WhatsApp Business App

2. **Required Credentials** (.env)
   ```
   WHATSAPP_API_TOKEN=EAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   WHATSAPP_PHONE_NUMBER_ID=123456789012345
   ```

3. **Get Phone Number ID**
   - Go to Meta Business Manager
   - WhatsApp > Settings > Phone Numbers
   - Copy the "Phone Number ID"

4. **Get API Token**
   - Go to Meta App Dashboard
   - Settings > User Token (with whatsapp_business_messaging scope)
   - Or use System User Token

#### Common WhatsApp Issues

1. **Invalid Phone Number**
   - Must be in E.164 format: +[country][number]
   - Example: +919080719253
   - No spaces or dashes

2. **"Invalid token" error**
   - Token might be expired
   - Check if token has correct permissions
   - Regenerate token from Meta Business Manager

3. **"Recipient not eligible" error**
   - Phone number not verified on WhatsApp Business
   - Must have active WhatsApp account on that number
   - Add phone to your WhatsApp contacts first

4. **Messages not arriving**
   - Check if WhatsApp phone number is active
   - Verify token has `whatsapp_business_messaging` scope
   - Check Meta Business logs for errors

5. **Rate Limiting**
   - Meta limits message rate
   - Wait between sending multiple messages
   - Check for 429 status code in error logs

#### WhatsApp Configuration (.env)
```
# WhatsApp Business Cloud (FREE)
WHATSAPP_API_TOKEN=EAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx        # Meta API Token
WHATSAPP_PHONE_NUMBER_ID=123456789012345                   # WhatsApp Business Phone ID

# Twilio WhatsApp (PAID - Optional)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx        # If using Twilio
TWILIO_AUTH_TOKEN=your_twilio_auth_token                   # If using Twilio
TWILIO_WHATSAPP_FROM=+14155238886                          # If using Twilio
```

---

## COMBINED SEND FLOW

When a booking is confirmed:

1. **Booking Status → Confirmed**
2. `updateStatus()` in bookingController
3. `sendConfirmationsIfNeeded()` triggered
   - **Email**: `sendBookingConfirmationEmail()`
   - **WhatsApp**: `sendBookingConfirmationWhatsApp()`
4. If either fails:
   - Error logged with `[EMAIL ERROR]` or `[WHATSAPP ERROR]`
   - Error saved in database
   - Continues to complete (doesn't block)
5. Booking saved with timestamps: `emailSentAt`, `whatsappSentAt`

---

## DEBUG LOG PREFIXES

| Prefix | Meaning | Examples |
|--------|---------|----------|
| `[STARTUP]` | Server initialization | Email/WhatsApp verification on start |
| `[EMAIL SERVICE]` | Email module ops | Transporter creation, verification |
| `[EMAIL SUCCESS]` | Email sent OK | Message ID returned |
| `[EMAIL ERROR]` | Email send failed | Error message + recipient |
| `[EMAIL TEST]` | Email test endpoint | Test email operations |
| `[WHATSAPP SERVICE]` | WhatsApp module ops | API verification |
| `[WHATSAPP SUCCESS]` | Message sent OK | Message/SID returned |
| `[WHATSAPP ERROR]` | Send failed | Error message + phone |
| `[WHATSAPP TEST]` | WhatsApp test endpoint | Test message operations |
| `[WHATSAPP BOOKING]` | Booking notifications | Confirmation/reschedule sends |
| `[BOOKING]` | Booking lifecycle | Status updates + notifications |

Search server logs for these prefixes to debug issues.

---

## QUICK DIAGNOSTICS

### Run These Tests in Order:

1. **Check Server Startup**
   ```
   npm run dev
   ```
   Look for:
   ```
   [EMAIL SERVICE] ✓ Email configuration verified successfully
   [WHATSAPP SERVICE] ✓ WhatsApp Business Cloud API verified successfully
   ```

2. **Test Email Config**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/bookings/test/email-config
   ```

3. **Test WhatsApp Config**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/bookings/test/whatsapp-config
   ```

4. **Send Test Email**
   ```bash
   curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"recipientEmail":"your_email@gmail.com"}' \
     http://localhost:3000/api/bookings/test/send-test-email
   ```

5. **Send Test WhatsApp**
   ```bash
   curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"recipientPhone":"+919080719253"}' \
     http://localhost:3000/api/bookings/test/send-test-whatsapp
   ```

6. **Create Test Booking**
   - Use admin dashboard to create booking
   - Confirm the booking
   - Check server logs for `[EMAIL SUCCESS]` and `[WHATSAPP SUCCESS]`

---

## FILES MODIFIED

### Email Enhancements
- ✓ `src/services/emailService.js` - Verification + logging
- ✓ `src/controllers/bookingController.js` - Error tracking
- ✓ `src/routes/bookingRoutes.js` - Test endpoints
- ✓ `src/server.js` - Startup verification
- ✓ `.env` - Fixed SMTP host

### WhatsApp Enhancements
- ✓ `src/services/whatsappService.js` - Verification + logging
- ✓ `src/routes/bookingRoutes.js` - Test endpoints
- ✓ `src/server.js` - Startup verification

---

## NEXT STEPS

1. **Restart server** with `npm run dev`
2. **Check startup logs** for verification messages
3. **Use test endpoints** to verify both email and WhatsApp work
4. **Create test booking** and confirm it
5. **Check logs** for `[EMAIL SUCCESS]` and `[WHATSAPP SUCCESS]`
6. **Verify delivery** - email and WhatsApp received

If still having issues, share the **exact error message** from the logs and I can pinpoint the problem.
