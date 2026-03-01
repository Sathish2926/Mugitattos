# Cloud Storage & Deployment Guide

## Overview

This guide covers deploying your Mugi Tattoo application with cloud storage (AWS S3) for scalable, production-ready file management.

---

## CLOUD STORAGE OPTIONS

Choose one of the following for your production deployment:

### 1. **AWS S3** ✓ (Recommended - Cheapest)
- **Cost**: $0.023 per GB stored, $0.0007 per 1000 requests
- **Best for**: Images, PDFs, general files
- **Setup**: 10 minutes
- **Reliability**: 99.99% uptime SLA

### 2. Google Cloud Storage
- **Cost**: $0.020 per GB stored
- **Best for**: Similar to S3
- **Integration**: Requires different credentials

### 3. Azure Blob Storage
- **Cost**: $0.0184 per GB stored
- **Best for**: Microsoft stack integrations

### 4. Firebase/Supabase
- **Cost**: Free tier available
- **Best for**: Rapid prototyping

---

## AWS S3 SETUP (Recommended)

### Step 1: Create AWS Account
1. Go to [AWS Console](https://console.aws.amazon.com)
2. Sign up with email and credit card
3. Verify your account

### Step 2: Create S3 Bucket
1. Go to **S3** → **Create Bucket**
2. **Bucket Name**: `mugi-tattoo-uploads` (or your name)
3. **Region**: Select closest to your users
   - **India**: `ap-south-1` (Mumbai)
   - **US**: `us-east-1` 
   - **Europe**: `eu-west-1`
4. **Block Public Access**: Uncheck `Block all public access`
5. Click **Create Bucket**

### Step 3: Enable Public Read Access
1. Go to the bucket → **Permissions** tab
2. **Bucket Policy** → Add:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mugi-tattoo-uploads/*"
    }
  ]
}
```
3. **Save**

### Step 4: Create IAM User for Application
1. Go to **IAM** → **Users** → **Create User**
2. Username: `mugi-tattoo-app`
3. Skip tags, click **Create User**
4. Go to **Security Credentials** → **Create Access Key**
5. Copy:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
6. **Keep these safe!** Never share with public

### Step 5: Attach S3 Policy to User
1. Go to **IAM** → **Users** → `mugi-tattoo-app`
2. **Add Permissions** → **Create Inline Policy**
3. Choose **JSON** tab and paste:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::mugi-tattoo-uploads",
        "arn:aws:s3:::mugi-tattoo-uploads/*"
      ]
    }
  ]
}
```
4. Click **Review Policy** → **Create Policy**

### Step 6: Get Bucket URL
1. Go to **S3** → Your bucket → **Properties**
2. Copy **Bucket Regional Domain Name**
3. Format: `https://mugi-tattoo-uploads.s3.amazonaws.com`

---

## ENVIRONMENT CONFIGURATION

### Development (Local Storage)
```env
# .env
STORAGE_MODE=local
```
- Files stored in `/uploads/gallery/`
- Good for testing

### Production (AWS S3)
```env
# .env (on your server)
STORAGE_MODE=s3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET=mugi-tattoo-uploads
AWS_S3_URL=https://mugi-tattoo-uploads.s3.amazonaws.com
```

---

## INSTALLATION & DEPLOYMENT

### Step 1: Install Dependencies
```bash
cd /path/to/MugiTattoo
npm install
```

This adds:
- `aws-sdk` - AWS SDK for Node.js
- `multer-s3` - Multer middleware for S3

### Step 2: Update .env for Server
Edit `.env` on your production server:
```env
NODE_ENV=production
STORAGE_MODE=s3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=mugi-tattoo-uploads
AWS_S3_URL=https://mugi-tattoo-uploads.s3.amazonaws.com
```

### Step 3: Deploy to Server
Deploy using your preferred method:
- **Heroku**: `git push heroku main`
- **AWS EC2**: SSH and `git pull`
- **DigitalOcean**: SSH and `git pull`
- **Railway.app**: Connect GitHub and auto-deploy
- **Render.com**: Connect GitHub and auto-deploy

### Step 4: Restart Application
```bash
npm run dev
# or
npm start
```

Check logs for:
```
[STARTUP] Storage mode: S3
[STARTUP] AWS S3 Bucket: mugi-tattoo-uploads
[STARTUP] AWS Region: ap-south-1
```

---

## UPLOADING IMAGES

### Admin Dashboard
1. Go to **Admin** → **Gallery**
2. Upload image file
3. Image automatically uploads to S3
4. URL stored in database

### API Endpoint
```bash
curl -X POST \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "title=Beautiful Tattoo" \
  -F "caption=Custom Dragon Design" \
  -F "isPublic=true" \
  http://localhost:3000/api/gallery
```

Response:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "imageUrl": "https://mugi-tattoo-uploads.s3.amazonaws.com/gallery/1704067200000-123456789.jpg",
  "title": "Beautiful Tattoo",
  "caption": "Custom Dragon Design",
  "isPublic": true,
  "createdAt": "2024-01-01T12:00:00Z"
}
```

---

## DATABASE CONFIGURATION

### Development
```env
MONGO_URI=mongodb://127.0.0.1:27017/mugitattoo
```

### Production (Cloud MongoDB)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mugitattoo?retryWrites=true&w=majority
```

---

## COMPLETE PRODUCTION .env

```env
# Server
PORT=3000
NODE_ENV=production

# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mugitattoo

# JWT
JWT_SECRET=K9f#21mUgi_Tattoos@2026!secure

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=mugitattoos@gmail.com
EMAIL_PASS=yyxq utjl grsx cufo
EMAIL_FROM=Mugi Tattoo <mugitattoos@gmail.com>

# Cloud Storage - AWS S3
STORAGE_MODE=s3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=mugi-tattoo-uploads
AWS_S3_URL=https://mugi-tattoo-uploads.s3.amazonaws.com

# WhatsApp
WHATSAPP_API_TOKEN=EAxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

---

## DEPLOYMENT PLATFORMS

### 1. **Railway.app** (Easiest)
```bash
# Install Railway CLI
# Connect GitHub repo
# Add environment variables
# Auto-deploy on push
```

### 2. **Render.com**
```bash
# Connect GitHub
# Create Web Service
# Set environment variables
# Auto-deploy
```

### 3. **Heroku**
```bash
# Install Heroku CLI
heroku create mugi-tattoo-api
git push heroku main
heroku config:set STORAGE_MODE=s3
heroku config:set AWS_ACCESS_KEY_ID=...
```

### 4. **AWS EC2**
```bash
# SSH into instance
ssh -i key.pem ec2-user@your-instance

# Clone repo
git clone your-repo
cd MugiTattoo

# Install Node
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install

# Create .env
export STORAGE_MODE=s3
# ... add other env vars

# Start with PM2 (process manager)
npm install -g pm2
pm2 start src/server.js
pm2 startup
pm2 save
```

### 5. **DigitalOcean App Platform**
```yaml
name: mugi-tattoo-api
services:
- name: api
  github:
    repo: yourusername/MugiTattoo
    branch: main
  envs:
  - key: STORAGE_MODE
    value: s3
  - key: AWS_REGION
    value: ap-south-1
  - key: AWS_ACCESS_KEY_ID
    value: ${AWS_ACCESS_KEY_ID}
  - key: AWS_SECRET_ACCESS_KEY
    value: ${AWS_SECRET_ACCESS_KEY}
  - key: MONGO_URI
    value: ${MONGO_URI}
  http_port: 3000
```

---

## MONITORING & COSTS

### AWS S3 Pricing Estimate
For typical tattoo gallery (100-200 images, ~5MB each):
- Storage: ~1GB = **$0.023/month**
- Requests: 1000/month = **$0.0007/month**
- **Total: ~$0.03/month**

### Cost Optimization
1. Enable versioning OFF (keeps costs low)
2. Use Intelligent Tiering for old files
3. Monitor CloudWatch metrics
4. Set lifecycle rules to delete old temp files

### Check S3 Usage
1. AWS Console → **S3** → Your bucket
2. **Metrics** tab shows:
   - Total storage
   - Number of objects
   - Request counts

---

## DATABASE BACKUP

### MongoDB Atlas Backup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Backup** tab
3. Enable **Continuous Backups**
4. Set retention to 30 days
5. Can restore to any point in time

### Manual Backup Script
```bash
# Create dump
mongodump --uri="mongodb+srv://user:password@cluster.mongodb.net/mugitattoo" \
  --out=./backups/$(date +%Y-%m-%d_%H-%M-%S)

# Restore from backup
mongorestore --uri="mongodb+srv://user:password@cluster.mongodb.net/mugitattoo" \
  ./backups/2024-01-01_12-00-00
```

---

## SECURITY CHECKLIST

- [ ] AWS credentials stored in `.env`, NOT in code
- [ ] S3 bucket blocks public PUT (upload) access
- [ ] Only authenticated admin can upload
- [ ] File validation (images only)
- [ ] File size limits enforced
- [ ] HTTPS enabled on server
- [ ] CORS configured properly
- [ ] MongoDB credentials protected
- [ ] Email credentials never in code
- [ ] JWT secret strong and unique

---

## TROUBLESHOOTING

### Issue: "Access Denied" uploading to S3
**Solution:**
- Check AWS credentials are correct
- Verify IAM user has S3 permissions
- Check bucket policy allows PutObject
- Verify AWS region matches bucket region

### Issue: Images showing as broken links
**Solution:**
- Verify S3 bucket is public readable
- Check `AWS_S3_URL` is correct
- Ensure bucket name matches in credentials
- Check CORS configuration

### Issue: "Credential not found" error
**Solution:**
- Set all AWS env variables
- Restart application after changing .env
- Check no spaces in credentials

### Issue: Upload slow or timeout
**Solution:**
- Compress images before uploading
- Increase timeout in nginx/reverse proxy
- Check internet connection
- Monitor S3 performance in CloudWatch

---

## FILES MODIFIED FOR CLOUD STORAGE

- ✓ `src/middleware/upload.js` - S3 + local storage support
- ✓ `src/controllers/galleryController.js` - Handle S3 URLs
- ✓ `src/server.js` - Log storage mode
- ✓ `package.json` - Added aws-sdk and multer-s3
- ✓ `.env` - Added S3 configuration

---

## NEXT STEPS

1. **Choose cloud provider** (AWS S3 recommended)
2. **Set up AWS account** and create S3 bucket
3. **Get credentials** (access key + secret)
4. **Update .env** with credentials
5. **Install dependencies**: `npm install`
6. **Test locally**: Upload image to verify
7. **Deploy** to production server
8. **Verify** storage mode in startup logs
9. **Test** image upload on production

### Quick Start Command
```bash
# Local development
STORAGE_MODE=local npm run dev

# Production with S3
STORAGE_MODE=s3 \
AWS_REGION=ap-south-1 \
AWS_ACCESS_KEY_ID=xxx \
AWS_SECRET_ACCESS_KEY=yyy \
AWS_S3_BUCKET=mugi-tattoo-uploads \
npm start
```

---

## NEED HELP?

- **AWS Error**: Check [AWS Documentation](https://docs.aws.amazon.com/s3/)
- **Node.js Issue**: Check [multer-s3 GitHub](https://github.com/badrap/multer-s3)
- **Deployment**: Check platform documentation
- **CORS Issues**: Update `app.js` CORS configuration

All files are production-ready. Happy deploying! 🚀
