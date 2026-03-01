const express = require('express');
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const gallery = require('../controllers/galleryController');
const upload = require('../middleware/upload');

const router = express.Router();

// Public list
router.get('/public', gallery.listPublic);

// Admin list all
router.get('/', auth, gallery.listAll);

// Create
router.post(
  '/',
  auth,
  upload.single('image'),
  [
    body('imageUrl').optional({ checkFalsy: true }).isURL().withMessage('Valid image URL required'),
    body('title').optional().isString().trim(),
    body('caption').optional().isString().trim(),
    body('tags').optional(),
    body('isPublic').optional().isBoolean(),
    body('order').optional().isInt(),
  ],
  validate,
  gallery.create
);

// Update
router.patch(
  '/:id',
  auth,
  upload.single('image'),
  [
    param('id').isMongoId(),
    body('imageUrl').optional({ checkFalsy: true }).isURL(),
    body('title').optional().isString().trim(),
    body('caption').optional().isString().trim(),
    body('tags').optional(),
    body('isPublic').optional().isBoolean(),
    body('order').optional().isInt(),
  ],
  validate,
  gallery.update
);

// Delete
router.delete(
  '/:id',
  auth,
  [param('id').isMongoId()],
  validate,
  gallery.remove
);

module.exports = router;
