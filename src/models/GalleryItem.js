const mongoose = require('mongoose');

const GalleryItemSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    caption: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryItem', GalleryItemSchema);
