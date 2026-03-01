# 🎨 Mugi Tattoo Booking System - Setup Guide

## 📋 Overview

This guide will help you set up the enhanced booking system with automated email and WhatsApp notifications.

---

## ✨ What's New

### 🎯 Enhanced Booking Page
- **Modern UI**: 3-step progress indicator (Details → Date & Time → Review)
- **Visual Time Slots**: Interactive grid of available time slots (10 AM - 6 PM)
- **Date Picker**: Modern calendar-style date selection
- **Live Summary**: Real-time booking summary sidebar
- **Simplified Form**: Removed size and placement fields
- **Mobile Optimized**: Responsive design with large tap-friendly buttons

### 🔔 Automated Notifications
- **Email Confirmations**: Professional HTML emails with studio details
- **WhatsApp Messages**: Formatted messages with emojis and booking info
- **Reschedule Alerts**: Automatic notifications when admin reschedules
- **Alternative Slots**: Send multiple time slot options to customers

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Already installed, but if you need to reinstall:
npm install

# Client dependencies
cd client
npm install
cd ..
```

### 2. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

### 3. Set Up Email (Gmail Recommended)

**For Gmail:**
1. Go to [Google Account Settings](https://myaccount.google.com)
2. Enable **2-Step Verification**
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Create an app password for "Mail"
5. Copy the 16-character password

**Update .env:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # Your app password
EMAIL_FROM=Mugi Tattoos <your-email@gmail.com>
```

### 4. Set Up WhatsApp (Choose One Option)

#### Option A: Twilio WhatsApp (Recommended for Testing)

**Setup:**
1. Sign up at [Twilio](https://www.twilio.com/try-twilio)
2. Navigate to: **Console → Messaging → Try it out → Send a WhatsApp message**
3. Copy your credentials

**Update .env:**
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=+14155238886  # Twilio's sandbox number
```

**Important - Opt-in Required:**
- Before testing, customers must send: `join <your-sandbox-name>` to the Twilio WhatsApp number
- For testing, send this message from your own phone first

#### Option B: WhatsApp Cloud API (Production)

**Setup:**
1. Go to [Meta for Developers](https://developers.facebook.com/apps)
2. Create a new Business app
3. Add WhatsApp product
4. Complete Business verification
5. Get Phone Number ID and API Token

**Update .env:**
```env
WHATSAPP_API_TOKEN=EAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

### 5. Update Studio Address

**Edit these files and replace `[Your Studio Address Here]` with your actual address:**

**File 1:** `src/services/emailService.js`
```javascript
// Around line 40 and line 90
Mugi Tattoo Studio
123 Main Street, Floor 2
Chennai, Tamil Nadu 600001
India
```

**File 2:** `src/services/whatsappService.js`
```javascript
// Around line 75 and line 100
Mugi Tattoo Studio
123 Main Street, Chennai
```

### 6. Start the Application

```bash
# Terminal 1: Start backend server
npm run dev

# Terminal 2: Start frontend client
cd client
npm run dev
```

Your application will be available at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

---

## 🧪 Testing Notifications

### Test Email Notifications

1. Open http://localhost:5173/booking
2. Fill out the booking form
3. Submit the booking
4. Login to admin panel: http://localhost:5173/admin
5. Go to booking management
6. **Confirm** the booking
7. Check your email inbox for confirmation

### Test WhatsApp Notifications

**If using Twilio:**
1. First, opt-in by sending `join <sandbox-name>` to Twilio's WhatsApp number from your phone
2. Use your phone number (in E.164 format, e.g., +919876543210) when filling the booking form
3. Confirm the booking from admin panel
4. Check WhatsApp for the message

**If using WhatsApp Cloud API:**
1. Ensure your phone number is registered with Meta Business
2. Use registered number in booking form
3. Confirm from admin panel
4. Check WhatsApp

### Test Reschedule Notifications

1. From admin panel, select a confirmed booking
2. Click **Reschedule**
3. Choose a new date and time
4. Save changes
5. Customer receives email + WhatsApp with new details

---

## 📱 Booking Page Features

### Step 1: Customer Details
- Full Name (required)
- Email (required)
- Phone (required, format: +91 XXXXX XXXXX)
- Tattoo Description (required)
- Additional Notes (optional)

### Step 2: Date & Time Selection
- **Date Picker**: Select from available dates (future dates only)
- **Time Slots**: Visual grid of 9 time slots (10 AM - 6 PM)
- Click to select, selected slot highlights with accent color

### Step 3: Review & Submit
- Review all details before submitting
- Edit by clicking "Previous" button
- Submit sends booking request to admin
- Customer receives confirmation that request is received

### Live Summary Sidebar (Desktop)
- Shows booking details in real-time
- Current step indicator
- "What's Next" information
- Quick WhatsApp contact link

---

## 🎨 Design Highlights

### Colors & Theming
- **Primary**: Blackcurrant (#2b193d)
- **Accent**: Plum (#6b46c1)
- **Highlight**: Accent Red (#ff5e4d)
- **Text**: Off-white (#f5f5dc)

### Animations
- Smooth page transitions (Framer Motion)
- Hover effects on buttons and time slots
- Progress indicator animations
- Scale effects on selections

### Mobile Responsive
- Single column layout on mobile
- Large tap-friendly buttons
- Summary moves below form on mobile
- Optimized for touch interactions

---

## 📧 Email Template Features

- **Professional HTML design** with your brand colors
- **Appointment details** with date, time, description
- **Studio location** and contact information
- **Before session checklist** (hydration, clothing, ID, etc.)
- **Payment information** (Cash/UPI)
- **Responsive design** works on mobile email clients

---

## 💬 WhatsApp Message Format

```
✅ *Booking Confirmed - Mugi Tattoos*

Hi John! 👋

Your tattoo session is confirmed!

📅 *Date & Time:*
Mon, Jan 15 at 2:00 PM

🎨 *Tattoo:*
Dragon sleeve design

📍 *Location:*
Mugi Tattoo Studio
123 Main Street, Chennai

💡 *Important:*
• Eat well before your session
• Stay hydrated
• Avoid alcohol 24hrs before
• Bring valid ID

Need to reschedule? Reply to this message!

See you soon! 🖤
_Mugi Tattoo Studio_
```

---

## 🔧 Troubleshooting

### Email Not Sending

**Check:**
- Correct SMTP credentials in `.env`
- App password (not regular password) for Gmail
- Port 587 is not blocked by firewall
- Check server console for error messages

**Test Connection:**
```bash
# From root directory
node -e "require('./src/services/emailService').sendBookingConfirmationEmail({customerName: 'Test', email: 'your-email@gmail.com', tattooDescription: 'Test tattoo', scheduledDate: new Date()})"
```

### WhatsApp Not Sending

**Twilio Issues:**
- Verify Account SID and Auth Token are correct
- Ensure recipient opted in to sandbox
- Phone numbers must be in E.164 format (+919876543210)
- Check Twilio console logs

**WhatsApp Cloud API Issues:**
- Verify API token is valid
- Check phone number is verified with Meta
- Ensure Business account is approved
- Review Meta API logs

### Booking Form Validation Issues

**If form won't submit:**
- Check all required fields are filled
- Date must be today or future date
- Time slot must be selected
- Email format must be valid
- Check browser console for JavaScript errors

### Time Slots Not Showing

**Check:**
- `TIME_SLOTS` array in `client/src/pages/Booking.jsx`
- Browser JavaScript console for errors
- Framer Motion is installed: `cd client && npm list framer-motion`

---

## 📝 Customization Guide

### Add More Time Slots

**Edit:** `client/src/pages/Booking.jsx`
```javascript
const TIME_SLOTS = [
  '09:00 AM',  // Add morning slot
  '10:00 AM', 
  '11:00 AM',
  // ... existing slots
  '07:00 PM',  // Add evening slot
  '08:00 PM'
]
```

### Change Progress Steps

**Edit:** `client/src/pages/Booking.jsx`
```javascript
const STEPS = [
  'Personal Info',      // Rename step 1
  'Schedule',           // Rename step 2
  'Confirmation'        // Rename step 3
]
```

### Customize Email Template

**Edit:** `src/services/emailService.js`
- Update HTML template in `sendBookingConfirmationEmail` function
- Modify colors, fonts, layout
- Add your logo (use online image URL)

### Customize WhatsApp Messages

**Edit:** `src/services/whatsappService.js`
- Update message templates
- Add/remove emojis
- Change message structure
- Modify formatting

---

## 🔒 Security Best Practices

1. **Never commit .env file** - Already in `.gitignore`
2. **Use strong JWT_SECRET** - Generate random string
3. **Enable rate limiting** for API endpoints (consider adding)
4. **Use HTTPS in production** - Required for WhatsApp Cloud API
5. **Validate phone numbers** - Server-side validation
6. **Sanitize user inputs** - Already implemented in middleware

---

## 🚀 Deployment Checklist

### Before Going Live:

- [ ] Update `.env` with production credentials
- [ ] Change `JWT_SECRET` to strong random string
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Update studio address in email/WhatsApp services
- [ ] Test all notification flows
- [ ] Set up WhatsApp Business API (not sandbox)
- [ ] Configure production SMTP (not Gmail for high volume)
- [ ] Enable MongoDB authentication
- [ ] Set up SSL certificate
- [ ] Configure proper CORS settings
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Create backup strategy for database

### Environment Variables for Production:

```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mugitattoo
JWT_SECRET=super_secure_random_string_at_least_32_chars
FRONTEND_URL=https://yourdomain.com
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=Mugi Tattoos <bookings@mugitattoos.com>
WHATSAPP_API_TOKEN=EAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

---

## 📚 Additional Resources

- **Twilio WhatsApp Docs:** https://www.twilio.com/docs/whatsapp
- **WhatsApp Cloud API:** https://developers.facebook.com/docs/whatsapp
- **Nodemailer Docs:** https://nodemailer.com/
- **Gmail SMTP:** https://support.google.com/mail/answer/7126229
- **Framer Motion:** https://www.framer.com/motion/

---

## 💡 Support

If you encounter issues:

1. Check server console logs
2. Check browser console (F12)
3. Review this setup guide
4. Verify all environment variables
5. Test with simple values first
6. Check API endpoint responses

---

## 🎉 You're All Set!

Your booking system is now ready with:
- ✅ Modern, user-friendly booking interface
- ✅ Automated email confirmations
- ✅ WhatsApp notifications
- ✅ Professional message templates
- ✅ Mobile-responsive design
- ✅ Admin booking management

Happy tattooing! 🎨✨

---

**Made with 🖤 for Mugi Tattoo Studio**
