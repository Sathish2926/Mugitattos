require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

(async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env');
      process.exit(1);
    }
    if (password.length < 8) {
      console.error('ADMIN_PASSWORD must be at least 8 characters long');
      process.exit(1);
    }

    await connectDB();

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log(`Admin already exists for ${email}. No changes made.`);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, passwordHash });
    console.log('Admin created:', { id: admin._id.toString(), email: admin.email });
    console.log('You can now log in at /admin with these credentials.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed admin:', err.message);
    process.exit(1);
  }
})();
