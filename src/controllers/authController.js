const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const signToken = (admin) => {
  return jwt.sign(
    { adminId: admin._id.toString(), email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );
};

exports.register = async (req, res, next) => {
  try {
    const setupToken = req.headers['x-setup-token'];
    if (!process.env.ADMIN_SETUP_TOKEN || setupToken !== process.env.ADMIN_SETUP_TOKEN) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Admin already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, passwordHash });
    return res.status(201).json({ id: admin._id, email: admin.email });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken(admin);
    return res.json({ token });
  } catch (err) {
    next(err);
  }
};
