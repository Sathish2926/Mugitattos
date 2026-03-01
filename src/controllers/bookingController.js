const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const emailService = require('../services/emailService');
const whatsappService = require('../services/whatsappService');

const sendConfirmationsIfNeeded = async (booking) => {
  if (booking.status === 'confirmed') {
    console.log(`[BOOKING] Sending confirmations for booking ${booking._id} (${booking.customerName})`);
    try {
      await emailService.sendBookingConfirmationEmail(booking);
      booking.emailSentAt = new Date();
      console.log(`[BOOKING] Email confirmation sent for ${booking._id}`);
    } catch (e) {
      console.error(`[BOOKING] Email send FAILED for ${booking._id}:`, e.message);
      booking.emailSendError = e.message;
    }
    try {
      await whatsappService.sendBookingConfirmationWhatsApp(booking);
      booking.whatsappSentAt = new Date();
      console.log(`[BOOKING] WhatsApp confirmation sent for ${booking._id}`);
    } catch (e) {
      console.error(`[BOOKING] WhatsApp send FAILED for ${booking._id}:`, e.message);
      booking.whatsappSendError = e.message;
    }
    await booking.save();
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const data = {
      customerName: req.body.customerName,
      email: req.body.email,
      phone: req.body.phone,
      tattooDescription: req.body.tattooDescription,
      placement: req.body.placement,
      size: req.body.size,
      preferredDate: req.body.preferredDate,
      status: 'pending',
      channel: 'web',
      isManual: false,
      notes: req.body.notes,
    };
    const booking = await Booking.create(data);
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

exports.createManualBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const status = req.body.status || 'pending';
    const data = {
      customerName: req.body.customerName,
      email: req.body.email,
      phone: req.body.phone,
      tattooDescription: req.body.tattooDescription,
      placement: req.body.placement,
      size: req.body.size,
      preferredDate: req.body.preferredDate,
      scheduledDate: req.body.scheduledDate,
      status,
      channel: 'call',
      isManual: true,
      notes: req.body.notes,
    };
    const booking = await Booking.create(data);
    await sendConfirmationsIfNeeded(booking);
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const allowed = [
      'customerName','email','phone','tattooDescription','placement','size',
      'preferredDate','scheduledDate','notes'
    ];
    for (const key of allowed) {
      if (req.body[key] !== undefined) booking[key] = req.body[key];
    }

    await booking.save();
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

exports.rescheduleBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.status = 'reschedule';
    booking.scheduledDate = req.body.scheduledDate;
    booking.rescheduleReason = req.body.rescheduleReason;
    await booking.save();

    // notify
    try { await emailService.sendRescheduleEmail(booking); } catch (e) { console.warn('Email reschedule failed:', e.message); }
    try { await whatsappService.sendRescheduleWhatsApp(booking); } catch (e) { console.warn('WhatsApp reschedule failed:', e.message); }

    res.json(booking);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!Booking.STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.status = status;
    await booking.save();
    await sendConfirmationsIfNeeded(booking);
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

// Admin: send alternative time slots without changing status
exports.sendAlternatives = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    const { alternatives = [], message = '' } = req.body;
    if (!Array.isArray(alternatives) || alternatives.length === 0) {
      return res.status(400).json({ error: 'Provide at least one alternative time' });
    }
    // send notifications
    try { await emailService.sendAlternativeSlotsEmail(booking, alternatives, message); } catch (e) { console.warn('Email alternatives failed:', e.message); }
    try { await whatsappService.sendAlternativeSlotsWhatsApp(booking, alternatives, message); } catch (e) { console.warn('WhatsApp alternatives failed:', e.message); }
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

exports.listBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && Booking.STATUSES.includes(status)) filter.status = status;
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};
