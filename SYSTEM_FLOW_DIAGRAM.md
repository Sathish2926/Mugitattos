# 🔄 Booking System - Data Flow Diagram

## Complete User Journey & Automation Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CUSTOMER BOOKING FLOW                           │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  Customer    │
│  Opens       │────────────────────────────────────┐
│  /booking    │                                    │
└──────────────┘                                    ▼
                                        ┌─────────────────────────┐
                                        │  STEP 1: Your Details   │
                                        ├─────────────────────────┤
                                        │  • Full Name            │
                                        │  • Email                │
                                        │  • Phone                │
                                        │  • Tattoo Description   │
                                        │  • Notes (optional)     │
                                        └─────────────────────────┘
                                                    │
                                        [Validation: All required fields?]
                                                    │ YES
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  STEP 2: Date & Time    │
                                        ├─────────────────────────┤
                                        │  • Date Picker          │
                                        │    (future dates only)  │
                                        │  • Time Slot Grid       │
                                        │    (9 slots: 10AM-6PM)  │
                                        └─────────────────────────┘
                                                    │
                                        [Validation: Date & time selected?]
                                                    │ YES
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  STEP 3: Review         │
                                        ├─────────────────────────┤
                                        │  • Show all details     │
                                        │  • Formatted display    │
                                        │  • Edit option          │
                                        │  • Confirm button       │
                                        └─────────────────────────┘
                                                    │
                                        [Customer clicks "Confirm Booking"]
                                                    │
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  POST /api/bookings     │
                                        │  {                      │
                                        │    customerName,        │
                                        │    email,               │
                                        │    phone,               │
                                        │    tattooDescription,   │
                                        │    preferredDate,       │
                                        │    notes                │
                                        │  }                      │
                                        └─────────────────────────┘
                                                    │
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  Backend Validation     │
                                        │  • Express Validator    │
                                        │  • Sanitization         │
                                        │  • Format checking      │
                                        └─────────────────────────┘
                                                    │
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  Save to MongoDB        │
                                        │  status: "pending"      │
                                        │  isManual: false        │
                                        │  channel: "web"         │
                                        └─────────────────────────┘
                                                    │
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  Return 201 Created     │
                                        │  { booking object }     │
                                        └─────────────────────────┘
                                                    │
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  Show Success Message   │
                                        │  "Booking submitted!"   │
                                        │  Form resets to Step 1  │
                                        └─────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        ADMIN CONFIRMATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  Admin       │
│  Logs In     │────────────────────────────────────┐
│  /admin      │                                    │
└──────────────┘                                    ▼
                                        ┌─────────────────────────┐
                                        │  Admin Dashboard        │
                                        │  • View all bookings    │
                                        │  • Filter by status     │
                                        │  • See pending items    │
                                        └─────────────────────────┘
                                                    │
                                        [Admin reviews booking details]
                                                    │
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  Admin clicks           │
                                        │  "Confirm" button       │
                                        └─────────────────────────┘
                                                    │
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  PATCH /api/bookings/   │
                                        │  :id/status             │
                                        │  { status: "confirmed" }│
                                        └─────────────────────────┘
                                                    │
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  Update in MongoDB      │
                                        │  status = "confirmed"   │
                                        └─────────────────────────┘
                                                    │
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  Trigger Notifications  │
                                        │  sendConfirmationsIf    │
                                        │  Needed(booking)        │
                                        └─────────────────────────┘
                                                    │
                                    ┌───────────────┴───────────────┐
                                    ▼                               ▼
                        ┌─────────────────────┐       ┌─────────────────────┐
                        │  EMAIL SERVICE      │       │  WHATSAPP SERVICE   │
                        ├─────────────────────┤       ├─────────────────────┤
                        │  • Get transporter  │       │  • Check provider   │
                        │  • Format date/time │       │  • Format message   │
                        │  • Build HTML email │       │  • Send via API     │
                        │  • Send via SMTP    │       │    (Twilio/Cloud)   │
                        └─────────────────────┘       └─────────────────────┘
                                    │                               │
                        [Send confirmation email]     [Send WhatsApp message]
                                    │                               │
                                    ▼                               ▼
                        ┌─────────────────────┐       ┌─────────────────────┐
                        │  Success/Failure    │       │  Success/Failure    │
                        │  Log to console     │       │  Log to console     │
                        └─────────────────────┘       └─────────────────────┘
                                    │                               │
                                    └───────────────┬───────────────┘
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  Update Booking Doc     │
                                        │  emailSentAt = now()    │
                                        │  whatsappSentAt = now() │
                                        └─────────────────────────┘
                                                    │
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  Return to Admin        │
                                        │  Status updated: ✓      │
                                        └─────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          RESCHEDULE FLOW                                │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  Admin       │
│  Clicks      │────────────────────────────────────┐
│  Reschedule  │                                    │
└──────────────┘                                    ▼
                                        ┌─────────────────────────┐
                                        │  Reschedule Modal       │
                                        ├─────────────────────────┤
                                        │  • New date picker      │
                                        │  • New time input       │
                                        │  • Reason (optional)    │
                                        └─────────────────────────┘
                                                    │
                                        [Admin enters new date/time/reason]
                                                    │
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  POST /api/bookings/    │
                                        │  :id/reschedule         │
                                        │  {                      │
                                        │    scheduledDate,       │
                                        │    rescheduleReason     │
                                        │  }                      │
                                        └─────────────────────────┘
                                                    │
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  Update in MongoDB      │
                                        │  status = "reschedule"  │
                                        │  scheduledDate = new    │
                                        │  rescheduleReason = txt │
                                        └─────────────────────────┘
                                                    │
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  Trigger Notifications  │
                                        │  • sendRescheduleEmail  │
                                        │  • sendRescheduleWA     │
                                        └─────────────────────────┘
                                                    │
                                    ┌───────────────┴───────────────┐
                                    ▼                               ▼
                        ┌─────────────────────┐       ┌─────────────────────┐
                        │  Email Service      │       │  WhatsApp Service   │
                        │  • New date/time    │       │  • New date/time    │
                        │  • Reason included  │       │  • Reason included  │
                        │  • Send email       │       │  • Send message     │
                        └─────────────────────┘       └─────────────────────┘
                                    │                               │
                                    └───────────────┬───────────────┘
                                                    ▼
                                        ┌─────────────────────────┐
                                        │  Customer Receives      │
                                        │  • Email notification   │
                                        │  • WhatsApp message     │
                                        │  with new date/time     │
                                        └─────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA MODELS                                   │
└─────────────────────────────────────────────────────────────────────────┘

Booking Document (MongoDB):
┌───────────────────────────────────────┐
│  _id: ObjectId                        │
│  customerName: String (required)      │
│  email: String (required)             │
│  phone: String (required)             │
│  tattooDescription: String (required) │
│  placement: String (optional)         │ ← Not used in new form
│  size: String (optional)              │ ← Not used in new form
│  preferredDate: Date                  │
│  scheduledDate: Date (admin sets)     │
│  status: "pending" | "confirmed" |    │
│          "reschedule"                 │
│  rescheduleReason: String             │
│  isManual: Boolean (false for web)    │
│  channel: "web" | "call"              │
│  notes: String                        │
│  emailSentAt: Date                    │ ← Timestamp when email sent
│  whatsappSentAt: Date                 │ ← Timestamp when WhatsApp sent
│  createdAt: Date (auto)               │
│  updatedAt: Date (auto)               │
└───────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          NOTIFICATION DETAILS                           │
└─────────────────────────────────────────────────────────────────────────┘

Email Confirmation Template:
┌─────────────────────────────────────┐
│  Subject: ✓ Your Tattoo Session is │
│           Confirmed - Mugi Tattoos  │
├─────────────────────────────────────┤
│  Content:                           │
│  • Professional HTML design         │
│  • Brand colors (blackcurrant/plum) │
│  • Appointment details              │
│  • Studio address & contact         │
│  • Pre-session checklist:           │
│    - Stay hydrated                  │
│    - Eat well                       │
│    - Wear comfortable clothing      │
│    - Avoid alcohol 24hrs before     │
│    - Bring valid ID                 │
│  • Payment info (Cash/UPI)          │
│  • Reschedule policy                │
│  • Instagram link                   │
└─────────────────────────────────────┘

WhatsApp Confirmation Message:
┌─────────────────────────────────────┐
│  ✅ *Booking Confirmed*             │
│  Hi [Name]! 👋                      │
│                                     │
│  Your tattoo session is confirmed!  │
│                                     │
│  📅 *Date & Time:*                  │
│  [Formatted date]                   │
│                                     │
│  🎨 *Tattoo:*                       │
│  [Description]                      │
│                                     │
│  📍 *Location:*                     │
│  [Studio address]                   │
│                                     │
│  💡 *Important:*                    │
│  • Eat well                         │
│  • Stay hydrated                    │
│  • Avoid alcohol 24hrs              │
│  • Bring valid ID                   │
│                                     │
│  See you soon! 🖤                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           ERROR HANDLING                                │
└─────────────────────────────────────────────────────────────────────────┘

Email Send Failure:
┌─────────────────────────────────────┐
│  Try {                              │
│    await emailService.send()        │
│  } catch (error) {                  │
│    console.warn('Email failed')     │
│    // Don't block booking update    │
│    // Email timestamp stays null    │
│  }                                  │
└─────────────────────────────────────┘

WhatsApp Send Failure:
┌─────────────────────────────────────┐
│  Try {                              │
│    await whatsappService.send()     │
│  } catch (error) {                  │
│    console.warn('WhatsApp failed')  │
│    // Don't block booking update    │
│    // WhatsApp timestamp stays null │
│  }                                  │
└─────────────────────────────────────┘

Graceful Degradation:
• Booking is saved even if notifications fail
• Admin can see which notifications failed
• Admin can manually notify customer
• Errors logged to console for debugging

┌─────────────────────────────────────────────────────────────────────────┐
│                          CONFIGURATION FLOW                             │
└─────────────────────────────────────────────────────────────────────────┘

Environment Variables (.env):
┌─────────────────────────────────────┐
│  EMAIL_HOST=smtp.gmail.com          │
│  EMAIL_PORT=587                     │
│  EMAIL_USER=your@email.com          │
│  EMAIL_PASS=app_password            │
│  EMAIL_FROM=Mugi <your@email.com>   │
│                                     │
│  TWILIO_ACCOUNT_SID=ACxxxxxx        │
│  TWILIO_AUTH_TOKEN=xxxxxxx          │
│  TWILIO_WHATSAPP_FROM=+14155238886  │
│                                     │
│  OR                                 │
│                                     │
│  WHATSAPP_API_TOKEN=EAxxxxxx        │
│  WHATSAPP_PHONE_NUMBER_ID=12345     │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  Services Initialize on Demand      │
├─────────────────────────────────────┤
│  emailService.getTransporter()      │
│  • Creates Nodemailer transport     │
│  • Caches for reuse                 │
│                                     │
│  whatsappService.send()             │
│  • Checks which provider configured │
│  • Uses Twilio OR WhatsApp Cloud    │
└─────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          SECURITY MEASURES                              │
└─────────────────────────────────────────────────────────────────────────┘

✅ Environment variables (not in code)
✅ .env in .gitignore (never committed)
✅ Server-side validation (Express Validator)
✅ Input sanitization middleware
✅ JWT authentication for admin routes
✅ Rate limiting on public endpoints (recommended)
✅ CORS configuration
✅ Helmet security headers
✅ MongoDB injection prevention
✅ XSS protection

┌─────────────────────────────────────────────────────────────────────────┐
│                        MONITORING & LOGGING                             │
└─────────────────────────────────────────────────────────────────────────┘

Console Logs:
• Booking created
• Email sent/failed (with reason)
• WhatsApp sent/failed (with reason)
• Timestamps updated

Database Tracking:
• emailSentAt timestamp (null if failed)
• whatsappSentAt timestamp (null if failed)
• Admin can check notification status

Future Enhancements:
• Error tracking (Sentry)
• Analytics dashboard
• Notification retry queue
• Delivery confirmations

```

## 🎯 Key Takeaways

1. **Customer Journey**: 3-step form → Submit → Wait for admin
2. **Admin Action**: Review → Confirm/Reschedule → Notifications auto-send
3. **Notification Flow**: Simultaneous email + WhatsApp
4. **Error Handling**: Graceful failures, booking still saved
5. **Security**: All credentials in .env, never in code
6. **Monitoring**: Timestamps track notification success

## 📊 Success Indicators

✅ **Booking Saved**: Entry in MongoDB
✅ **Email Sent**: emailSentAt has timestamp
✅ **WhatsApp Sent**: whatsappSentAt has timestamp
✅ **Customer Notified**: Both timestamps populated

## 🆘 Troubleshooting Quick Reference

| Issue | Check | Solution |
|-------|-------|----------|
| Email fails | emailSentAt = null | Verify SMTP credentials |
| WhatsApp fails | whatsappSentAt = null | Check Twilio/Cloud API config |
| Booking not visible | Database connection | Check MongoDB URI |
| Form validation | Browser console | Check required fields |

---

**Complete system overview for Mugi Tattoo Studio booking automation**
