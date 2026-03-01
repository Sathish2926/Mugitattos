const nodemailer = require('nodemailer');

let transporter;
let verificationAttempted = false;
let verificationSuccess = false;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!host || !user || !pass) {
    throw new Error('Email transport not configured. Set EMAIL_HOST, EMAIL_USER, EMAIL_PASS');
  }
  console.log(`[EMAIL SERVICE] Creating transporter for ${host}:${port} as ${user}`);
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

async function verifyTransporter() {
  if (verificationAttempted) return verificationSuccess;
  verificationAttempted = true;
  
  try {
    const t = getTransporter();
    await t.verify();
    console.log('[EMAIL SERVICE] ✓ Email configuration verified successfully');
    verificationSuccess = true;
    return true;
  } catch (err) {
    console.error('[EMAIL SERVICE] ✗ Email configuration failed:', err.message);
    verificationSuccess = false;
    return false;
  }
}

// Export for initialization
exports.verifyEmailConfig = verifyTransporter;

function formatDate(dt) {
  if (!dt) return 'TBD';
  const date = new Date(dt);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatTime(dt) {
  if (!dt) return 'TBD';
  const date = new Date(dt);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
}

exports.sendBookingConfirmationEmail = async (booking) => {
  const t = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const subject = `✓ Your Tattoo Session is Confirmed - Mugi Tattoos`;
  
  const scheduledDate = booking.scheduledDate || booking.preferredDate;
  const dateStr = formatDate(scheduledDate);
  const timeStr = formatTime(scheduledDate);
  
  const text = `Hi ${booking.customerName},

Great news! Your tattoo session at Mugi Tattoos is confirmed.

📅 APPOINTMENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date & Time: ${dateStr}
Description: ${booking.tattooDescription}

📍 STUDIO LOCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mugi Tattoo Studio
[Your Studio Address Here]

📞 CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phone: +91 90807 19253
WhatsApp: +91 90807 19253

⚡ BEFORE YOUR SESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Stay hydrated and eat well before your appointment
• Wear comfortable clothing (easy access to tattoo area)
• Avoid alcohol 24 hours before your session
• Bring a valid ID
• Payment: Cash/UPI accepted

If you need to reschedule, please let us know at least 24 hours in advance.

Looking forward to creating something amazing with you!

Best regards,
Mugi Tattoo Studio

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Follow us on Instagram: @mugitattoos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a0a2e; color: #f5f5dc; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #ff5e4d; font-size: 28px; margin: 0;">Mugi Tattoos</h1>
        <p style="color: #6b46c1; font-size: 14px; margin: 5px 0;">Premium Tattoo Studio</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #2b193d 0%, #1a0a2e 100%); border: 1px solid #6b46c1; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
        <h2 style="color: #ff5e4d; margin-top: 0;">✓ Booking Confirmed!</h2>
        <p style="font-size: 16px; line-height: 1.6;">Hi <strong>${booking.customerName}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.6;">Great news! Your tattoo session is confirmed.</p>
        
        <div style="background: rgba(255, 94, 77, 0.1); border-left: 3px solid #ff5e4d; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #ff5e4d; margin: 0 0 10px 0; font-size: 16px;">📅 Appointment Details</h3>
          <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${dateStr}</p>
          <p style="margin: 5px 0;"><strong>Description:</strong> ${booking.tattooDescription}</p>
        </div>

        <div style="background: rgba(107, 70, 193, 0.1); border-left: 3px solid #6b46c1; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #6b46c1; margin: 0 0 10px 0; font-size: 16px;">📍 Studio Location</h3>
          <p style="margin: 5px 0;">Mugi Tattoo Studio<br>[Your Studio Address Here]</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> +91 90807 19253</p>
        </div>

        <div style="background: rgba(245, 245, 220, 0.05); padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #f5f5dc; margin: 0 0 10px 0; font-size: 16px;">⚡ Before Your Session</h3>
          <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
            <li>Stay hydrated and eat well</li>
            <li>Wear comfortable clothing</li>
            <li>Avoid alcohol 24 hours before</li>
            <li>Bring a valid ID</li>
            <li>Payment: Cash/UPI accepted</li>
          </ul>
        </div>

        <p style="font-size: 14px; color: #f5f5dc; opacity: 0.8; margin-top: 20px;">
          If you need to reschedule, please let us know at least 24 hours in advance.
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #6b46c1;">
        <p style="font-size: 14px; color: #f5f5dc; opacity: 0.7;">
          Looking forward to creating something amazing with you!<br>
          <strong>Mugi Tattoo Studio</strong>
        </p>
        <p style="font-size: 12px; color: #6b46c1; margin-top: 10px;">
          Follow us on Instagram: @mugitattoos
        </p>
      </div>
    </div>
  `;

  try {
    const info = await t.sendMail({ from, to: booking.email, subject, text, html });
    console.log(`[EMAIL SUCCESS] Confirmation email sent to ${booking.email}. MessageID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`[EMAIL ERROR] Failed to send confirmation to ${booking.email}:`, err.message);
    throw err;
  }
};

exports.sendRescheduleEmail = async (booking) => {
  const t = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const subject = `📅 Booking Rescheduled - Mugi Tattoos`;
  
  const newDate = formatDate(booking.scheduledDate);
  
  const text = `Hi ${booking.customerName},

Your tattoo session has been rescheduled.

📅 NEW APPOINTMENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date & Time: ${newDate}
Description: ${booking.tattooDescription}
${booking.rescheduleReason ? `\nReason: ${booking.rescheduleReason}` : ''}

📍 STUDIO LOCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mugi Tattoo Studio
[Your Studio Address Here]

📞 CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phone: +91 90807 19253
WhatsApp: +91 90807 19253

Please confirm your availability for the new date and time.

Thank you for your understanding!

Best regards,
Mugi Tattoo Studio`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a0a2e; color: #f5f5dc; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #ff5e4d; font-size: 28px; margin: 0;">Mugi Tattoos</h1>
        <p style="color: #6b46c1; font-size: 14px; margin: 5px 0;">Premium Tattoo Studio</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #2b193d 0%, #1a0a2e 100%); border: 1px solid #6b46c1; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
        <h2 style="color: #ff5e4d; margin-top: 0;">📅 Booking Rescheduled</h2>
        <p style="font-size: 16px; line-height: 1.6;">Hi <strong>${booking.customerName}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.6;">Your tattoo session has been rescheduled.</p>
        
        <div style="background: rgba(255, 94, 77, 0.1); border-left: 3px solid #ff5e4d; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #ff5e4d; margin: 0 0 10px 0; font-size: 16px;">📅 New Appointment</h3>
          <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${newDate}</p>
          <p style="margin: 5px 0;"><strong>Description:</strong> ${booking.tattooDescription}</p>
          ${booking.rescheduleReason ? `<p style="margin: 15px 0 5px 0;"><strong>Reason:</strong> ${booking.rescheduleReason}</p>` : ''}
        </div>

        <div style="background: rgba(107, 70, 193, 0.1); border-left: 3px solid #6b46c1; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #6b46c1; margin: 0 0 10px 0; font-size: 16px;">📍 Studio Location</h3>
          <p style="margin: 5px 0;">Mugi Tattoo Studio<br>[Your Studio Address Here]</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> +91 90807 19253</p>
        </div>

        <p style="font-size: 14px; color: #f5f5dc; opacity: 0.8; margin-top: 20px;">
          Please confirm your availability for the new date and time by replying to this email or contacting us via WhatsApp.
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #6b46c1;">
        <p style="font-size: 14px; color: #f5f5dc; opacity: 0.7;">
          Thank you for your understanding!<br>
          <strong>Mugi Tattoo Studio</strong>
        </p>
      </div>
    </div>
  `;

  try {
    const info = await t.sendMail({ from, to: booking.email, subject, text, html });
    console.log(`[EMAIL SUCCESS] Reschedule email sent to ${booking.email}. MessageID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`[EMAIL ERROR] Failed to send reschedule email to ${booking.email}:`, err.message);
    throw err;
  }
};

exports.sendAlternativeSlotsEmail = async (booking, alternatives, message = '') => {
  const t = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const subject = `Alternative Time Slots - Mugi Tattoo`;
  const altLines = alternatives.map((a, i) => `Option ${i+1}: ${formatDate(a)}`).join('\n');
  const text = `Hi ${booking.customerName},\n\nWe have the following alternative time slots available:\n${altLines}\n${message ? '\nNote: ' + message : ''}\n\nPlease reply with your preferred option.\nMugi Tattoo Studio`;
  
  try {
    const info = await t.sendMail({ from, to: booking.email, subject, text });
    console.log(`[EMAIL SUCCESS] Alternative slots email sent to ${booking.email}. MessageID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`[EMAIL ERROR] Failed to send alternative slots to ${booking.email}:`, err.message);
    throw err;
  }
};
