const axios = require('axios');
const twilio = require('twilio');

let verificationAttempted = false;
let verificationSuccess = false;

function usingTwilio() {
  return (
    !!process.env.TWILIO_ACCOUNT_SID &&
    !!process.env.TWILIO_AUTH_TOKEN &&
    !!process.env.TWILIO_WHATSAPP_FROM
  );
}

function usingWhatsAppCloud() {
  return (
    !!process.env.WHATSAPP_API_TOKEN &&
    !!process.env.WHATSAPP_PHONE_NUMBER_ID
  );
}

async function verifyWhatsAppConfig() {
  if (verificationAttempted) return verificationSuccess;
  verificationAttempted = true;
  
  if (usingTwilio()) {
    console.log('[WHATSAPP SERVICE] Using Twilio (PAID - skipping verification)');
    verificationSuccess = true;
    return true;
  }
  
  if (usingWhatsAppCloud()) {
    try {
      const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}`;
      const headers = { Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}` };
      const response = await axios.get(url, { headers });
      console.log('[WHATSAPP SERVICE] ✓ WhatsApp Business Cloud API verified successfully');
      verificationSuccess = true;
      return true;
    } catch (err) {
      console.error('[WHATSAPP SERVICE] ✗ WhatsApp Business Cloud API verification failed:', err.message);
      verificationSuccess = false;
      return false;
    }
  }
  
  console.warn('[WHATSAPP SERVICE] ⚠️  WhatsApp not configured (optional)');
  verificationSuccess = false;
  return false;
}

// Export for initialization
exports.verifyWhatsAppConfig = verifyWhatsAppConfig;
exports.getWhatsAppStatus = () => ({
  isTwilio: usingTwilio(),
  isWhatsAppCloud: usingWhatsAppCloud(),
  verificationAttempted,
  verificationSuccess
});

function formatDate(dt) {
  if (!dt) return 'TBD';
  const date = new Date(dt);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

async function sendViaTwilio(toPhone, body) {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const from = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`; // e.g., 'whatsapp:+14155238886'
  const to = `whatsapp:${toPhone}`; // E.164 format
  try {
    const message = await client.messages.create({ from, to, body });
    console.log(`[WHATSAPP SUCCESS] Twilio message sent to ${toPhone}. SID: ${message.sid}`);
    return message;
  } catch (err) {
    console.error(`[WHATSAPP ERROR] Twilio failed to send to ${toPhone}:`, err.message);
    throw err;
  }
}

async function sendViaWhatsAppCloud(toPhone, body) {
  const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const headers = { Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}` };
  const payload = {
    messaging_product: 'whatsapp',
    to: toPhone,
    type: 'text',
    text: { body },
  };
  try {
    const response = await axios.post(url, payload, { headers });
    console.log(`[WHATSAPP SUCCESS] Cloud API message sent to ${toPhone}. MessageID: ${response.data.messages[0].id}`);
    return response.data;
  } catch (err) {
    console.error(`[WHATSAPP ERROR] Cloud API failed to send to ${toPhone}:`, err.message);
    throw err;
  }
}

async function send(toPhone, body) {
  if (usingTwilio()) {
    console.log(`[WHATSAPP] Sending via Twilio to ${toPhone}`);
    return sendViaTwilio(toPhone, body);
  }
  if (usingWhatsAppCloud()) {
    console.log(`[WHATSAPP] Sending via WhatsApp Business Cloud to ${toPhone}`);
    return sendViaWhatsAppCloud(toPhone, body);
  }
  throw new Error('WhatsApp not configured. Set Twilio or WhatsApp Cloud env vars.');
}

exports.sendBookingConfirmationWhatsApp = async (booking) => {
  const scheduledDate = booking.scheduledDate || booking.preferredDate;
  const dateStr = formatDate(scheduledDate);
  
  const body = `✅ *Booking Confirmed - Mugi Tattoos*

Hi ${booking.customerName}! 👋

Your tattoo session is confirmed!

📅 *Date & Time:*
${dateStr}

🎨 *Tattoo:*
${booking.tattooDescription}

📍 *Location:*
Mugi Tattoo Studio
[Your Studio Address]

💡 *Important:*
• Eat well before your session
• Stay hydrated
• Avoid alcohol 24hrs before
• Bring valid ID

Need to reschedule? Reply to this message!

See you soon! 🖤
_Mugi Tattoo Studio_`;

  try {
    await send(booking.phone, body);
    console.log(`[WHATSAPP BOOKING] Confirmation sent to ${booking.customerName} (${booking.phone})`);
  } catch (err) {
    console.error(`[WHATSAPP BOOKING ERROR] Failed to send confirmation to ${booking.phone}:`, err.message);
    throw err;
  }
};

exports.sendRescheduleWhatsApp = async (booking) => {
  const newDate = formatDate(booking.scheduledDate);
  
  const body = `📅 *Booking Rescheduled - Mugi Tattoos*

Hi ${booking.customerName},

Your tattoo session has been rescheduled.

🕐 *New Date & Time:*
${newDate}

🎨 *Tattoo:*
${booking.tattooDescription}
${booking.rescheduleReason ? `\n❗ *Reason:*\n${booking.rescheduleReason}` : ''}

📍 *Location:*
Mugi Tattoo Studio
[Your Studio Address]

Please confirm your availability by replying to this message.

Thanks for understanding! 🙏
_Mugi Tattoo Studio_`;

  try {
    await send(booking.phone, body);
    console.log(`[WHATSAPP BOOKING] Reschedule sent to ${booking.customerName} (${booking.phone})`);
  } catch (err) {
    console.error(`[WHATSAPP BOOKING ERROR] Failed to send reschedule to ${booking.phone}:`, err.message);
    throw err;
  }
};

exports.sendAlternativeSlotsWhatsApp = async (booking, alternatives, message = '') => {
  const altLines = alternatives.map((a, i) => `${i+1}. ${formatDate(a)}`).join('\n');
  
  const body = `📅 *Alternative Time Slots - Mugi Tattoos*

Hi ${booking.customerName},

We have the following time slots available:

${altLines}
${message ? `\n💬 *Note:*\n${message}` : ''}

Please reply with your preferred option number (1, 2, etc.)

Thanks!
_Mugi Tattoo Studio_`;

  try {
    await send(booking.phone, body);
    console.log(`[WHATSAPP BOOKING] Alternatives sent to ${booking.customerName} (${booking.phone})`);
  } catch (err) {
    console.error(`[WHATSAPP BOOKING ERROR] Failed to send alternatives to ${booking.phone}:`, err.message);
    throw err;
  }
};
