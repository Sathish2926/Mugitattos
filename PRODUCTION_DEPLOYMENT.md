# Production Deployment Guide

Complete setup guide for deploying Mugi Tattoo to production with all cloud services.

---

## ARCHITECTURE

```
┌─────────────────────────────────────────────────────┐
│              Frontend (React + Vite)                │
│         Client deployed on Vercel/Netlify           │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS API calls
                   ↓
┌─────────────────────────────────────────────────────┐
│         Backend (Express.js + Node.js)              │
│    Deployed on Railway/Render/Heroku/AWS           │
└──────────────────┬──────────────────────────────────┘
                   │
       ┌───────────┼───────────┐
       ↓           ↓           ↓
┌────────────┐ ┌─────────┐ ┌──────────┐
│ MongoDB    │ │ AWS S3  │ │ Email    │
│ Atlas      │ │ Storage │ │ (Gmail)  │
│ (Cloud DB) │ │ (Files) │ │ (SMTP)   │
└────────────┘ └─────────┘ └──────────┘
```

---

## PRODUCTION STACK

### Database: MongoDB Atlas ✓
- **Type**: Cloud MongoDB
- **Status**: Already configured
- **URL**: `mongodb+srv://mugitattoos_db_user:7xU4Czleg70gRVDG@cluster0.cgaceru.mongodb.net/`
- **Cost**: FREE (512MB tier)
- **Documentation**: [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)

### File Storage: AWS S3 ✓
- **Type**: Cloud object storage
- **Status**: Ready to configure
- **Bucket**: `mugi-tattoo-uploads`
- **Cost**: ~$0.023/GB
- **Documentation**: [CLOUD_STORAGE_DEPLOYMENT.md](CLOUD_STORAGE_DEPLOYMENT.md)

### Email: Gmail SMTP ✓
- **Type**: Email delivery
- **Status**: Configured
- **User**: `mugitattoos@gmail.com`
- **Cost**: FREE
- **Documentation**: [EMAIL_TROUBLESHOOTING.md](EMAIL_TROUBLESHOOTING.md)

### Backend Server
- **Framework**: Express.js
- **Language**: Node.js
- **Version**: 18+
- **Deploy on**: Railway, Render, Heroku, AWS, DigitalOcean

### Frontend Server
- **Framework**: React + Vite
- **Build output**: Static files
- **Deploy on**: Vercel, Netlify, AWS S3

---

## DEPLOYMENT CHECKLIST

### Phase 1: Prepare Backend ✓

- [x] MongoDB Atlas configured
- [x] Email (Gmail SMTP) configured
- [x] WhatsApp configured
- [x] AWS S3 ready for configuration
- [x] Environment variables prepared

### Phase 2: Deploy Backend

- [ ] Choose hosting platform (Railway/Render/Heroku)
- [ ] Create account on platform
- [ ] Connect GitHub repository
- [ ] Add environment variables:
  ```env
  NODE_ENV=production
  PORT=3000
  MONGO_URI=mongodb+srv://mugitattoos_db_user:7xU4Czleg70gRVDG@cluster0.cgaceru.mongodb.net/?appName=Cluster0
  JWT_SECRET=K9f#21mUgi_Tattoos@2026!secure
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  EMAIL_USER=mugitattoos@gmail.com
  EMAIL_PASS=yyxq utjl grsx cufo
  EMAIL_FROM=Mugi Tattoo <mugitattoos@gmail.com>
  STORAGE_MODE=s3
  AWS_REGION=ap-south-1
  AWS_ACCESS_KEY_ID=YOUR_KEY
  AWS_SECRET_ACCESS_KEY=YOUR_SECRET
  AWS_S3_BUCKET=mugi-tattoo-uploads
  AWS_S3_URL=https://mugi-tattoo-uploads.s3.amazonaws.com
  WHATSAPP_API_TOKEN=YOUR_TOKEN
  WHATSAPP_PHONE_NUMBER_ID=YOUR_ID
  ```
- [ ] Deploy (auto-deploy on git push)
- [ ] Verify logs show MongoDB Atlas connection
- [ ] Test API endpoints

### Phase 3: Deploy Frontend

- [ ] Choose hosting (Vercel recommended)
- [ ] Connect GitHub
- [ ] Update API URL to backend:
  ```
  VITE_API_URL=https://your-backend.railway.app
  ```
- [ ] Deploy
- [ ] Test booking form
- [ ] Test admin login

### Phase 4: Configure Production

- [ ] Set up AWS S3 bucket (if not done)
- [ ] Configure backup schedule for MongoDB Atlas
- [ ] Test file uploads (gallery images)
- [ ] Test email sending (bookings)
- [ ] Test WhatsApp notifications
- [ ] Set up SSL certificate (auto on most platforms)
- [ ] Configure custom domain

---

## DEPLOYMENT PLATFORMS COMPARISON

### Railway.app (RECOMMENDED)
**Pros:**
- ✓ Easiest to use
- ✓ Auto-deploy on git push
- ✓ $5/month free credits
- ✓ Great documentation
- ✓ Perfect for startups

**Steps:**
1. Go to https://railway.app
2. Connect GitHub
3. Create new project
4. Select Node.js
5. Add env variables
6. Deploy

**Cost**: $5/month baseline + usage (~$0-20/month total)

### Render.com
**Pros:**
- ✓ Free tier available
- ✓ Auto SSL
- ✓ Good uptime

**Cost**: $7/month minimum

### Heroku
**Pros:**
- ✓ Well-known
- ✓ Easy CLI deployment
- ✓ Good add-ons

**Cost**: $7/month minimum (post-free tier)

### AWS
**Pros:**
- ✓ Most reliable
- ✓ Global CDN
- ✓ Scales infinitely

**Cost**: Pay-as-you-go (~$10-50/month)

### DigitalOcean App Platform
**Pros:**
- ✓ Affordable
- ✓ Based in India (good latency)
- ✓ Simple interface

**Cost**: $5/month minimum

---

## ENVIRONMENT VARIABLES - PRODUCTION

Create `.env` file on production server with:

```env
# Server
PORT=3000
NODE_ENV=production

# Database - MongoDB Atlas
MONGO_URI=mongodb+srv://mugitattoos_db_user:7xU4Czleg70gRVDG@cluster0.cgaceru.mongodb.net/?appName=Cluster0

# Security
JWT_SECRET=K9f#21mUgi_Tattoos@2026!secure
ADMIN_SETUP_TOKEN=one_time_setup_token

# Admin account
ADMIN_EMAIL=mugitattoos
ADMIN_PASSWORD=mugitattoos@10623

# Email - Gmail SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=mugitattoos@gmail.com
EMAIL_PASS=yyxq utjl grsx cufo
EMAIL_FROM=Mugi Tattoo <mugitattoos@gmail.com>

# Storage - AWS S3
STORAGE_MODE=s3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=mugi-tattoo-uploads
AWS_S3_URL=https://mugi-tattoo-uploads.s3.amazonaws.com

# WhatsApp
WHATSAPP_API_TOKEN=EAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

⚠️ **IMPORTANT**:
- Never commit `.env` to Git
- Store in platform's secret manager
- Rotate credentials regularly
- Use strong, unique passwords

---

## TESTING CHECKLIST

### Before Going Live

- [ ] Admin login works
- [ ] Create test booking
- [ ] Check booking in MongoDB Atlas
- [ ] Upload test gallery image
- [ ] Verify S3 bucket has image
- [ ] Confirm email sent on booking
- [ ] Check WhatsApp message sent
- [ ] Test on mobile (responsive)
- [ ] SSL certificate working
- [ ] Load times acceptable
- [ ] Logs show no errors
- [ ] Database backups working

### Post-Launch Monitoring

- [ ] Check daily logs
- [ ] Monitor MongoDB storage
- [ ] Review email delivery
- [ ] Check file upload success
- [ ] Monitor response times
- [ ] Set up alerts
- [ ] Weekly backup verification

---

## COST BREAKDOWN - MONTHLY

| Service | Cost | Notes |
|---------|------|-------|
| Backend Server | $5-20 | Railway, Render, Heroku |
| Frontend Server | $0-20 | Vercel (free tier) or Netlify |
| MongoDB Atlas | $0 | Free 512MB tier |
| AWS S3 Storage | $0.02-5 | ~1GB storage + requests |
| AWS S3 Bandwidth | $0-10 | ~100GB bandwidth |
| Email | $0 | Gmail SMTP free |
| WhatsApp | $0-5 | Meta cloud (depends on volume) |
| **TOTAL** | **$5-60/month** | Most days: $5-15/month |

---

## SECURITY CHECKLIST

- [ ] `.env` never committed to git
- [ ] All credentials in platform secrets
- [ ] HTTPS enforced
- [ ] MongoDB password strong (20+ chars)
- [ ] AWS keys rotated regularly
- [ ] Email credentials protected
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Admin password changed from default
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (using Mongoose)
- [ ] XSS protection (helmet middleware)
- [ ] CSRF tokens (if forms used)
- [ ] Regular security updates (npm audit)

---

## SCALING GUIDE

### If You Reach Limits

**More Bookings (10K+/month):**
- Database still fine (free tier)
- Consider caching for faster API
- Add Redis for sessions

**More Gallery Images (10GB+):**
- MongoDB still fine
- S3 storage negligible cost
- Add CloudFront CDN for caching

**High Traffic (1000+ concurrent):**
- Add horizontal scaling (multiple servers)
- Add load balancer
- Cache static assets
- Database read replicas

**High Storage (100GB+):**
- Upgrade MongoDB tier (~$50/month)
- Or compress images
- Archive old images

---

## ROLLBACK PROCEDURE

If something breaks in production:

1. **Stop deployment** - Disable auto-deploy on platform
2. **Switch environment** - Revert to last working commit
3. **Check logs** - See what failed
4. **Fix code** - Update files
5. **Test locally** - Verify fix works
6. **Push to Git** - Commit fix
7. **Redeploy** - Re-enable auto-deploy
8. **Monitor** - Watch logs for 1 hour

**Database rollback:**
1. Go to MongoDB Atlas
2. Backups → Select pre-incident snapshot
3. Click Restore
4. Confirm (will overwrite current data)

---

## USEFUL COMMANDS

### SSH into Server
```bash
ssh -i key.pem user@your-host
cd /path/to/app
```

### Monitor Logs
```bash
# View last 50 lines
npm run dev

# Production (with PM2)
pm2 logs

# Stream real-time
tail -f logs/app.log
```

### Restart Application
```bash
npm start

# Or with PM2
pm2 restart app
```

### Update Code
```bash
git pull origin main
npm install
npm run build
pm2 restart app
```

### Check Details
```bash
# Database size
db.stats()

# Active users
db.sessions.countDocuments()

# Recent bookings
db.bookings.find().sort({ createdAt: -1 }).limit(10)
```

---

## SUPPORT RESOURCES

### Documentation
- [MongoDB Atlas Setup](MONGODB_ATLAS_SETUP.md)
- [Cloud Storage Deployment](CLOUD_STORAGE_DEPLOYMENT.md)
- [Email Troubleshooting](EMAIL_TROUBLESHOOTING.md)

### Platforms
- **Railway**: https://railway.app/support
- **Render**: https://render.com/docs
- **Heroku**: https://devcenter.heroku.com
- **MongoDB**: https://docs.mongodb.com

### Monitoring
- MongoDB Atlas Dashboard: https://account.mongodb.com
- AWS S3 Console: https://aws.amazon.com
- Gmail Security: https://myaccount.google.com

---

## IP WHITELIST CONFIGURATION

If you get "IP not whitelisted" error:

1. Go to MongoDB Atlas → Security → Network Access
2. Click **Add IP Address**
3. Whitelist options:
   - Add specific IP (production server IP)
   - Add your office IP
   - Allow 0.0.0.0/0 (anywhere - less secure)

---

## SSL CERTIFICATE

Most platforms provide automatic SSL:
- ✓ Railway: Automatic
- ✓ Render: Automatic
- ✓ Heroku: Automatic
- ✓ Vercel: Automatic

If manual setup needed:
1. Use Let's Encrypt (free)
2. Or buy from Namecheap, GoDaddy
3. Install on server

---

## DAILY CHECKS

Run these daily after launch:

1. **Check logs** - Any errors?
2. **Test upload** - Can you upload image?
3. **Test booking** - Can you create booking?
4. **Check storage** - MongoDB size OK?
5. **Check email** - Receive test email?

---

## FINAL CHECKLIST

- [ ] All services configured
- [ ] Backend deployed and working
- [ ] Frontend deployed and working
- [ ] Custom domain working
- [ ] SSL certificate active
- [ ] Emails being sent
- [ ] Files uploading to S3
- [ ] Database backups scheduled
- [ ] Monitoring alerts set
- [ ] Team trained
- [ ] Documentation shared
- [ ] Go live! 🚀

---

You're ready for production! Start with backend deployment on Railway.app - it's the easiest path.
