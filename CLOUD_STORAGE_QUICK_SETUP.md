# Quick Start: Cloud Storage Setup

## Current Status
- **Development**: Using local storage (`/uploads/gallery/`)
- **Production**: Ready for AWS S3

---

## QUICK SETUP

### Option 1: Stay Local (Development)
```bash
# In .env
STORAGE_MODE=local

# Run server
npm run dev
```
✓ Files stored in `/uploads/gallery/`
✓ No AWS credentials needed
✓ Good for testing

---

### Option 2: Use AWS S3 (Production)

#### Step 1: 5-Minute AWS Setup
1. Go to https://console.aws.amazon.com
2. Search for **S3** → **Create Bucket**
3. Bucket name: `mugi-tattoo-uploads`
4. Region: Choose closest to you
5. Uncheck **Block Public Access** → Create

#### Step 2: Make Bucket Public
1. Go to bucket → **Permissions** tab
2. **Bucket Policy** → Edit
3. Paste & replace `your-bucket-name`:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::your-bucket-name/*"
  }]
}
```
4. Save

#### Step 3: Create Access Keys
1. Go to **IAM** → **Users** → **Create User**
2. Username: `mugi-tattoo-app`
3. Go to user → **Security Credentials**
4. **Create Access Key**
5. Copy both keys

#### Step 4: Configure App
Add to your `.env`:
```env
STORAGE_MODE=s3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=mugi-tattoo-uploads
AWS_S3_URL=https://mugi-tattoo-uploads.s3.amazonaws.com
```

#### Step 5: Install & Run
```bash
npm install
npm start
```

Check logs:
```
[STARTUP] Storage mode: S3
[STARTUP] AWS S3 Bucket: mugi-tattoo-uploads
[STARTUP] AWS Region: ap-south-1
```

#### Step 6: Test Upload
- Go to Admin Dashboard
- Upload image
- Should appear in S3 bucket

---

## VERIFY SETUP

### Check startup logs for:
```
✓ [STARTUP] Storage mode: S3
✓ [STARTUP] AWS S3 Bucket: mugi-tattoo-uploads
✓ [STARTUP] AWS Region: ap-south-1
```

### Test upload response:
```json
{
  "imageUrl": "https://mugi-tattoo-uploads.s3.amazonaws.com/gallery/1704067200000-123456789.jpg"
}
```

URL should be from S3, not `/uploads/gallery/`

---

## TROUBLESHOOTING

| Issue | Fix |
|-------|-----|
| "Access Denied" | Check IAM permissions |
| Images not uploading | Verify bucket name matches |
| 404 on images | Check S3 bucket is public |
| Slow uploads | Check internet speed |
| Wrong region error | Update `AWS_REGION` in .env |

---

## AWS MONTHLY COST
- **100 images** (5MB each = 500MB) = **$0.01/month**
- **1000 images** = **$0.10/month**
- **10000 images** = **$1.00/month**

Super cheap for production! 💰

---

## IMPORTANT NOTES

⚠️ **Keep credentials safe!**
- Never commit `.env` to git
- Regenerate keys if exposed
- Use strong secrets in production

✓ **Automatic CDN caching**
- Images cached at edge locations
- Fast delivery worldwide
- Reduces S3 costs

✓ **Zero setup maintenance**
- AWS handles backups
- 99.99% uptime guarantee
- Scales automatically

---

## DEPLOYMENT TO PRODUCTION

### Using Railway.app (Easiest)
```bash
# Connect GitHub
# Set environment variables in dashboard:
# STORAGE_MODE=s3
# AWS_ACCESS_KEY_ID=...
# AWS_SECRET_ACCESS_KEY=...
# AWS_S3_BUCKET=mugi-tattoo-uploads
# AWS_REGION=ap-south-1
# MONGO_URI=your_mongodb_atlas_url
# AUTO DEPLOYS ON GIT PUSH ✓
```

### Using Heroku
```bash
heroku create mugi-tattoo-api
git push heroku main
heroku config:set STORAGE_MODE=s3
heroku config:set AWS_ACCESS_KEY_ID=...
# etc...
```

### Using Render.com
Same as Railway - connect GitHub and set env vars

---

## NEXT STEPS

1. ✓ Code is ready for cloud storage
2. ⏭️ Create AWS account (5 minutes)
3. ⏭️ Get S3 credentials
4. ⏭️ Update `.env` file
5. ⏭️ Run `npm install && npm start`
6. ⏭️ Test image upload
7. ⏭️ Deploy to production

For detailed guide, see [CLOUD_STORAGE_DEPLOYMENT.md](CLOUD_STORAGE_DEPLOYMENT.md)

All code is production-ready! 🚀
