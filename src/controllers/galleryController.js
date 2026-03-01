const { validationResult } = require('express-validator');
const GalleryItem = require('../models/GalleryItem');
const uploadMiddleware = require('../middleware/upload');

const getImageUrl = (file) => {
  if (!file) return null;
  // S3 storage returns location property
  if (file.location) return file.location;
  // Local storage returns filename
  if (file.filename) return `/uploads/gallery/${file.filename}`;
  return null;
};

exports.listPublic = async (req, res, next) => {
  try {
    const items = await GalleryItem.find({ isPublic: true }).sort({ order: -1, createdAt: -1 });
    res.json(items);
  } catch (err) { next(err); }
};

exports.listAll = async (req, res, next) => {
  try {
    const items = await GalleryItem.find({}).sort({ order: -1, createdAt: -1 });
    res.json(items);
  } catch (err) { next(err); }
};

const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(t => String(t).trim()).filter(Boolean);
  if (typeof tags === 'string') return tags.split(',').map(t => t.trim()).filter(Boolean);
  return [];
};

const toBoolean = (value, defaultValue) => {
  if (value === undefined) return defaultValue;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return defaultValue;
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const fileUrl = req.file ? getImageUrl(req.file) : null;
    const bodyUrl = req.body.imageUrl || null;
    const imageUrl = fileUrl || bodyUrl;
    if (!imageUrl) return res.status(400).json({ error: 'Image file or URL required' });

    const title = req.body.title || '';
    const caption = req.body.caption || '';
    const tags = normalizeTags(req.body.tags);
    const isPublic = toBoolean(req.body.isPublic, true);
    const order = Number(req.body.order) || 0;

    const item = await GalleryItem.create({ imageUrl, title, caption, tags, isPublic, order });
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (req.file) {
      item.imageUrl = getImageUrl(req.file);
    } else if (req.body.imageUrl) {
      item.imageUrl = req.body.imageUrl;
    }

    if (req.body.title !== undefined) item.title = req.body.title;
    if (req.body.caption !== undefined) item.caption = req.body.caption;
    if (req.body.tags !== undefined) item.tags = normalizeTags(req.body.tags);
    if (req.body.isPublic !== undefined) item.isPublic = toBoolean(req.body.isPublic, item.isPublic);
    if (req.body.order !== undefined) item.order = Number(req.body.order) || 0;

    await item.save();
    res.json(item);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
};
