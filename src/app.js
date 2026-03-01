const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./middleware/errorHandler');

const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'http://localhost:3000', 'https://localhost:3000', 'http://localhost:5174', 'https://*.s3.amazonaws.com', 'https://*.cloudfront.net', 'https://']
    }
  }
}));
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// SEO Routes - Serve robots.txt and sitemap.xml
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`# Robots.txt for Mugi Tattoo Studio
# Allow search engines to crawl the site

User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /uploads/
Allow: /uploads/gallery/

# Specific rules for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /

# Specific rules for bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

# Sitemap location
Sitemap: https://mugi-tattoo.com/sitemap.xml`);
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
  
  <!-- Home Page -->
  <url>
    <loc>https://mugi-tattoo.com/</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Gallery Page -->
  <url>
    <loc>https://mugi-tattoo.com/gallery</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Booking Page -->
  <url>
    <loc>https://mugi-tattoo.com/booking</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Contact Page -->
  <url>
    <loc>https://mugi-tattoo.com/contact</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

</urlset>`);
});

// Set SEO-friendly headers
app.use((req, res, next) => {
  // Allow search engines to index the site
  res.setHeader('X-Robots-Tag', 'index, follow');
  
  // Add canonical URL header
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = req.get('host');
  res.setHeader('Link', `<${protocol}://${host}${req.path}>; rel="canonical"`);
  
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/gallery', galleryRoutes);

app.use(errorHandler);

module.exports = app;
