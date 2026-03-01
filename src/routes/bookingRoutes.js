const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// Public: create booking
router.post(
  '/',
  [
    body('customerName').isString().isLength({ min: 2 }).trim(),
    body('email').isEmail().normalizeEmail(),
    body('phone').isString().isLength({ min: 8 }).trim(),
    body('tattooDescription').isString().isLength({ min: 5 }).trim(),
    body('placement').optional().isString().trim(),
    body('size').optional().isString().trim(),
    body('preferredDate').optional().isISO8601(),
    body('notes').optional().isString().trim(),
  ],
  validate,
  bookingController.createBooking
);

// Admin: manual booking entry (call booking)
router.post(
  '/manual',
  auth,
  [
    body('customerName').isString().isLength({ min: 2 }).trim(),
    body('email').isEmail().normalizeEmail(),
    body('phone').isString().isLength({ min: 8 }).trim(),
    body('tattooDescription').isString().isLength({ min: 5 }).trim(),
    body('placement').optional().isString().trim(),
    body('size').optional().isString().trim(),
    body('preferredDate').optional().isISO8601(),
    body('scheduledDate').optional().isISO8601(),
    body('status').optional().isIn(['pending','confirmed','reschedule']),
    body('notes').optional().isString().trim(),
  ],
  validate,
  bookingController.createManualBooking
);

// Admin: update booking
router.patch(
  '/:id',
  auth,
  [
    param('id').isMongoId(),
    body('customerName').optional().isString().isLength({ min: 2 }).trim(),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().isString().isLength({ min: 8 }).trim(),
    body('tattooDescription').optional().isString().isLength({ min: 5 }).trim(),
    body('placement').optional().isString().trim(),
    body('size').optional().isString().trim(),
    body('preferredDate').optional().isISO8601(),
    body('scheduledDate').optional().isISO8601(),
    body('notes').optional().isString().trim(),
  ],
  validate,
  bookingController.updateBooking
);

// Admin: reschedule booking
router.post(
  '/:id/reschedule',
  auth,
  [
    param('id').isMongoId(),
    body('scheduledDate').isISO8601(),
    body('rescheduleReason').optional().isString().trim(),
  ],
  validate,
  bookingController.rescheduleBooking
);

// Admin: update status
router.patch(
  '/:id/status',
  auth,
  [
    param('id').isMongoId(),
    body('status').isIn(['pending','confirmed','reschedule']),
  ],
  validate,
  bookingController.updateStatus
);

// Admin: send alternative time slots (notifications only)
router.post(
  '/:id/alternatives',
  auth,
  [
    param('id').isMongoId(),
    body('alternatives').isArray({ min: 1 }),
    body('alternatives.*').isISO8601(),
    body('message').optional().isString().trim(),
  ],
  validate,
  bookingController.sendAlternatives
);

// Admin: get booking
router.get(
  '/:id',
  auth,
  [param('id').isMongoId()],
  validate,
  bookingController.getBooking
);

// Admin: list bookings
router.get(
  '/',
  auth,
  [query('status').optional().isIn(['pending','confirmed','reschedule'])],
  validate,
  bookingController.listBookings
);

// Test endpoint: verify email configuration
router.get(
  '/test/email-config',
  auth,
  async (req, res, next) => {
    try {
      const emailService = require('../services/emailService');
      const isConfigured = await emailService.verifyEmailConfig();
      if (isConfigured) {
        res.json({ 
          status: 'OK', 
          message: 'Email configuration is valid and working',
          details: {
            host: process.env.EMAIL_HOST,
            user: process.env.EMAIL_USER,
            from: process.env.EMAIL_FROM
          }
        });
      } else {
        res.status(400).json({ 
          status: 'FAILED', 
          message: 'Email configuration failed verification. Check logs for details.'
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

// Test endpoint: send test email
router.post(
  '/test/send-test-email',
  auth,
  [
    body('recipientEmail').isEmail().normalizeEmail()
  ],
  validate,
  async (req, res, next) => {
    try {
      const nodemailer = require('nodemailer');
      const host = process.env.EMAIL_HOST;
      const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
      const user = process.env.EMAIL_USER;
      const pass = process.env.EMAIL_PASS;
      
      if (!host || !user || !pass) {
        return res.status(400).json({ 
          error: 'Email configuration not set',
          required: ['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS']
        });
      }
      
      const testTransporter = nodemailer.createTransport({
        host, port,
        secure: port === 465,
        auth: { user, pass }
      });
      
      console.log(`[EMAIL TEST] Attempting to send test email to ${req.body.recipientEmail}`);
      const info = await testTransporter.sendMail({
        from: process.env.EMAIL_FROM || user,
        to: req.body.recipientEmail,
        subject: '[TEST] Mugi Tattoo Email Configuration Test',
        text: 'This is a test email to verify your email configuration is working correctly.',
        html: '<div><h2>Test Email</h2><p>This is a test email to verify your email configuration is working correctly.</p><p><strong>Mugi Tattoo Studio</strong></p></div>'
      });
      
      console.log(`[EMAIL TEST] Test email sent successfully. MessageID: ${info.messageId}`);
      res.json({ 
        status: 'SUCCESS',
        message: 'Test email sent successfully',
        messageId: info.messageId,
        recipientEmail: req.body.recipientEmail
      });
    } catch (err) {
      console.error('[EMAIL TEST] Failed to send test email:', err.message);
      res.status(500).json({ 
        status: 'FAILED',
        error: err.message,
        hint: 'Check EMAIL_HOST, EMAIL_USER, EMAIL_PASS in .env file'
      });
    }
  }
);

// Test endpoint: verify WhatsApp configuration
router.get(
  '/test/whatsapp-config',
  auth,
  async (req, res, next) => {
    try {
      const whatsappService = require('../services/whatsappService');
      const isConfigured = await whatsappService.verifyWhatsAppConfig();
      const status = whatsappService.getWhatsAppStatus();
      
      if (isConfigured) {
        const service = status.isTwilio ? 'Twilio (Paid)' : 'WhatsApp Business Cloud API';
        res.json({ 
          status: 'OK', 
          message: `WhatsApp configuration is valid and working (${service})`,
          details: {
            service,
            isTwilio: status.isTwilio,
            isWhatsAppCloud: status.isWhatsAppCloud,
            phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || 'Not set'
          }
        });
      } else {
        res.status(400).json({ 
          status: 'FAILED', 
          message: 'WhatsApp configuration failed verification. Check logs for details.',
          hint: 'Set either Twilio or WhatsApp Business Cloud credentials'
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

// Test endpoint: send test WhatsApp message
router.post(
  '/test/send-test-whatsapp',
  auth,
  [
    body('recipientPhone').isString().isLength({ min: 8 }).trim()
  ],
  validate,
  async (req, res, next) => {
    try {
      const axios = require('axios');
      const whatsappService = require('../services/whatsappService');
      const status = whatsappService.getWhatsAppStatus();
      
      const toPhone = req.body.recipientPhone;
      const body = `🧪 *Test Message - Mugi Tattoos*\n\nThis is a test message to verify WhatsApp is configured correctly.\n\nIf you receive this, your WhatsApp integration is working! ✅\n\n_Mugi Tattoo Studio_`;
      
      if (status.isTwilio) {
        // Twilio test
        try {
          const twilio = require('twilio');
          const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
          const from = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;
          const to = `whatsapp:${toPhone}`;
          const message = await client.messages.create({ from, to, body });
          
          console.log(`[WHATSAPP TEST] Twilio test message sent to ${toPhone}. SID: ${message.sid}`);
          res.json({ 
            status: 'SUCCESS',
            message: 'Test WhatsApp message sent via Twilio',
            provider: 'Twilio',
            messageSid: message.sid,
            recipientPhone: toPhone
          });
        } catch (err) {
          console.error('[WHATSAPP TEST] Twilio failed:', err.message);
          throw err;
        }
      } else if (status.isWhatsAppCloud) {
        // WhatsApp Cloud API test
        try {
          const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
          const headers = { Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}` };
          const payload = {
            messaging_product: 'whatsapp',
            to: toPhone,
            type: 'text',
            text: { body }
          };
          
          const response = await axios.post(url, payload, { headers });
          console.log(`[WHATSAPP TEST] Cloud API test message sent to ${toPhone}. MessageID: ${response.data.messages[0].id}`);
          res.json({ 
            status: 'SUCCESS',
            message: 'Test WhatsApp message sent via Business Cloud API',
            provider: 'WhatsApp Business Cloud',
            messageId: response.data.messages[0].id,
            recipientPhone: toPhone
          });
        } catch (err) {
          console.error('[WHATSAPP TEST] Cloud API failed:', err.response?.data || err.message);
          throw err;
        }
      } else {
        res.status(400).json({ 
          error: 'WhatsApp not configured',
          required: ['Twilio credentials OR WhatsApp Cloud credentials']
        });
      }
    } catch (err) {
      console.error('[WHATSAPP TEST] Failed to send test message:', err.message);
      res.status(500).json({ 
        status: 'FAILED',
        error: err.message,
        hint: 'Check WhatsApp credentials in .env file'
      });
    }
  }
);

module.exports = router;
