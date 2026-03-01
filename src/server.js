require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const emailService = require('./services/emailService');
const whatsappService = require('./services/whatsappService');
const uploadMiddleware = require('./middleware/upload');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    
    // Log storage mode
    console.log(`[STARTUP] Storage mode: ${uploadMiddleware.storageMode.toUpperCase()}`);
    if (uploadMiddleware.storageMode === 's3') {
      console.log(`[STARTUP] AWS S3 Bucket: ${process.env.AWS_S3_BUCKET}`);
      console.log(`[STARTUP] AWS Region: ${process.env.AWS_REGION}`);
    }
    
    // Verify email configuration
    console.log('[STARTUP] Verifying email configuration...');
    const emailConfigOk = await emailService.verifyEmailConfig();
    if (!emailConfigOk) {
      console.error('[STARTUP] ⚠️  Email configuration failed - emails will NOT be sent');
    }
    
    // Verify WhatsApp configuration
    console.log('[STARTUP] Verifying WhatsApp configuration...');
    const whatsappConfigOk = await whatsappService.verifyWhatsAppConfig();
    const whatsappStatus = whatsappService.getWhatsAppStatus();
    if (whatsappConfigOk) {
      if (whatsappStatus.isTwilio) {
        console.log('[STARTUP] WhatsApp: Using Twilio (paid service)');
      } else if (whatsappStatus.isWhatsAppCloud) {
        console.log('[STARTUP] WhatsApp: Using WhatsApp Business Cloud API');
      }
    } else {
      console.warn('[STARTUP] ⚠️  WhatsApp not configured - messages will NOT be sent');
    }
    
    app.listen(PORT, () => {
      console.log(`[STARTUP] Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server due to DB error:', err.message);
    process.exit(1);
  }
})();
