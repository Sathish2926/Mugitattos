const mongoose = require('mongoose');

const STATUSES = ['pending', 'confirmed', 'reschedule'];

const BookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    tattooDescription: { type: String, required: true, trim: true },
    placement: { type: String, trim: true },
    size: { type: String, trim: true },

    preferredDate: { type: Date },
    scheduledDate: { type: Date },

    status: { type: String, enum: STATUSES, default: 'pending' },
    rescheduleReason: { type: String, trim: true },

    isManual: { type: Boolean, default: false },
    channel: { type: String, enum: ['web', 'call'], default: 'web' },

    notes: { type: String, trim: true },

    emailSentAt: { type: Date },
    whatsappSentAt: { type: Date },
  },
  { timestamps: true }
);

BookingSchema.statics.STATUSES = STATUSES;

module.exports = mongoose.model('Booking', BookingSchema);
