# 📱 Admin Quick Reference - Booking Notifications

## 🎯 How It Works

When you **confirm** or **reschedule** a booking from the admin panel, the system **automatically sends**:
1. ✉️ **Email notification** to the customer
2. 💬 **WhatsApp message** to the customer's phone

**No manual steps required!** Just click the action button and notifications are sent instantly.

---

## ✅ Confirming a Booking

### Steps:
1. Go to **Admin Dashboard** → **Bookings**
2. Find the booking with status **"pending"**
3. Click **"Confirm"** button
4. Booking status changes to **"confirmed"**
5. 🎉 **Automatic notifications sent!**
   - Email confirmation → Customer's email
   - WhatsApp message → Customer's phone

### What the Customer Receives:

**📧 Email:**
- Subject: "✓ Your Tattoo Session is Confirmed"
- Professional HTML email with:
  - Appointment date & time
  - Tattoo description
  - Studio address & contact
  - Pre-session checklist
  - Payment info

**💬 WhatsApp:**
```
✅ Booking Confirmed - Mugi Tattoos

Hi [Name]! 👋
Your tattoo session is confirmed!

📅 Date & Time: [Details]
🎨 Tattoo: [Description]
📍 Location: Studio address
💡 Important tips included

See you soon! 🖤
```

---

## 📅 Rescheduling a Booking

### Steps:
1. Go to **Admin Dashboard** → **Bookings**
2. Find the booking to reschedule
3. Click **"Reschedule"** button
4. Enter:
   - New date and time
   - Reason (optional but recommended)
5. Click **"Save"**
6. 🎉 **Automatic notifications sent!**

### What the Customer Receives:

**📧 Email:**
- Subject: "📅 Booking Rescheduled"
- New date & time clearly highlighted
- Optional reschedule reason
- Studio contact for confirmation

**💬 WhatsApp:**
```
📅 Booking Rescheduled - Mugi Tattoos

Hi [Name],
Your session has been rescheduled.

🕐 New Date & Time: [Details]
❗ Reason: [If provided]

Please confirm availability!
Thanks for understanding! 🙏
```

---

## 🛠️ Notification Status Tracking

### Check if Notifications Were Sent:

In the booking details, you'll see timestamps:
- **emailSentAt**: When email was sent
- **whatsappSentAt**: When WhatsApp was sent

If these fields are empty or show an error, check:
1. Email/WhatsApp configuration in `.env`
2. Server console logs for error messages
3. Customer's email/phone number is correct

---

## ⚠️ Troubleshooting

### Email Not Sending?
**Check:**
- `.env` file has correct EMAIL_HOST, EMAIL_USER, EMAIL_PASS
- Email credentials are valid (test by logging in)
- Port 587 is not blocked
- Server console for error messages

**Quick Test:**
```bash
# Send test email from server terminal
node -e "require('./src/services/emailService').sendBookingConfirmationEmail({
  customerName: 'Test User',
  email: 'your-test-email@gmail.com',
  tattooDescription: 'Test tattoo',
  scheduledDate: new Date()
})"
```

### WhatsApp Not Sending?
**Twilio Sandbox:**
- Customer must opt-in first
- Send "join [sandbox-name]" to Twilio number
- Phone number must be in E.164 format (+919876543210)

**WhatsApp Cloud API:**
- Verify API token is valid
- Phone number registered with Meta
- Business account approved

**Quick Test:**
```bash
# Send test WhatsApp from server terminal
node -e "require('./src/services/whatsappService').sendBookingConfirmationWhatsApp({
  customerName: 'Test User',
  phone: '+919876543210',
  tattooDescription: 'Test tattoo',
  scheduledDate: new Date()
})"
```

---

## 📞 Customer Contact Format

### Phone Number Requirements:
- Must include country code
- Format: +919876543210 (no spaces or dashes)
- Example formats:
  - ✅ +919876543210
  - ✅ +91 98765 43210 (spaces OK)
  - ❌ 9876543210 (missing country code)
  - ❌ 98765-43210 (has dash)

### Email Requirements:
- Valid email format
- Lowercase recommended
- Example formats:
  - ✅ customer@gmail.com
  - ✅ name.surname@email.com
  - ❌ customer@gmail (no domain)
  - ❌ customer @gmail.com (has space)

---

## 🎯 Best Practices

### When Confirming:
1. ✅ Double-check date & time is correct
2. ✅ Verify customer contact details
3. ✅ Add any notes to the booking
4. ✅ Check studio schedule for conflicts

### When Rescheduling:
1. ✅ Always provide a reason (builds trust)
2. ✅ Offer alternative dates if possible
3. ✅ Reschedule as early as possible
4. ✅ Follow up if customer doesn't respond

### Communication Tips:
- 📱 Customers prefer WhatsApp for quick responses
- 📧 Email is good for detailed information
- 🕐 Send notifications during business hours when possible
- 💬 Respond to customer replies within 24 hours

---

## 📊 Notification Timing

### Immediate Notifications:
- **Confirmation**: Sent instantly when you click "Confirm"
- **Reschedule**: Sent instantly when you save new date

### Reminder Notifications (Future Enhancement):
- Could add 24-hour reminder before appointment
- Could add follow-up after session for feedback

---

## 🔒 Privacy & Security

### Customer Data:
- Email and phone stored securely in database
- Notifications sent via secure channels
- Only visible to admin users
- Not shared with third parties

### API Credentials:
- Stored in `.env` file (not in code)
- Never committed to git
- Access restricted to server only
- Regularly update API tokens

---

## 📱 Example Scenarios

### Scenario 1: New Booking from Website
```
Customer submits booking
        ↓
Booking appears in admin dashboard (status: pending)
        ↓
You review booking details
        ↓
You click "Confirm"
        ↓
✅ Email + WhatsApp sent automatically
        ↓
Customer receives notifications
        ↓
Customer replies to confirm
```

### Scenario 2: Need to Reschedule
```
You need to change appointment time
        ↓
Open booking in admin panel
        ↓
Click "Reschedule"
        ↓
Enter new date/time + reason
        ↓
Click "Save"
        ↓
📅 Email + WhatsApp sent automatically
        ↓
Customer receives new date
        ↓
Customer confirms availability
```

### Scenario 3: Phone Booking (Manual Entry)
```
Customer calls to book
        ↓
You go to Admin → "Add Manual Booking"
        ↓
Enter customer details
        ↓
Set status to "confirmed" (if confirmed on call)
        ↓
Click "Create"
        ↓
✅ Email + WhatsApp sent automatically
        ↓
Customer receives confirmation
```

---

## 💡 Quick Tips

1. **Always verify phone numbers** - WhatsApp won't send to invalid numbers
2. **Check spam folders** - Ask customers to check spam if they don't see email
3. **Save customer replies** - Add them to booking notes
4. **Use notes field** - Document important details about booking
5. **Monitor server logs** - Check for any sending failures

---

## 🆘 Need Help?

### Check These First:
1. Server console output
2. Browser console (F12)
3. `.env` file configuration
4. Customer contact information format

### Common Issues:

**"Email failed to send"**
→ Check EMAIL_USER and EMAIL_PASS in `.env`

**"WhatsApp failed to send"**
→ Check TWILIO credentials or WHATSAPP_API_TOKEN

**"Customer didn't receive anything"**
→ Verify email/phone number is correct

**"Notification shows as sent but customer didn't get it"**
→ Check spam folder (email) or WhatsApp opt-in status

---

## 📋 Admin Checklist

Before going live with notifications:

- [ ] Test email sending with your own email
- [ ] Test WhatsApp with your own phone
- [ ] Verify all studio details in message templates
- [ ] Update studio address in email and WhatsApp services
- [ ] Test confirmation flow end-to-end
- [ ] Test reschedule flow end-to-end
- [ ] Verify timestamps are updating (emailSentAt, whatsappSentAt)
- [ ] Check server logs for any errors
- [ ] Have backup plan (manual notifications) if system fails

---

**🎉 Notifications are fully automated - just focus on providing great service!**

**Questions?** Check `BOOKING_SETUP_GUIDE.md` for detailed setup instructions.
