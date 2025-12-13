# Deployment Guide - AI Chatbot Enhanced Website

## Overview

This guide covers deploying the AI-powered business website with the enhanced chatbot feature.

## Frontend Deployment (Static Files)

The frontend is a static website that can be deployed to various hosting platforms.

### Option 1: GitHub Pages

1. **Push to GitHub repository**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select branch: `main` or `website-start`
   - Select folder: `/ (root)`
   - Click Save

3. **Access your site**
   - URL: `https://username.github.io/repository-name`

### Option 2: Netlify

1. **Connect repository**
   - Go to [netlify.com](https://www.netlify.com)
   - Click "New site from Git"
   - Select your GitHub repository

2. **Configure build settings**
   - Build command: (leave empty - static site)
   - Publish directory: `/`

3. **Deploy**
   - Click "Deploy site"
   - Netlify will assign a URL: `random-name.netlify.app`
   - Optional: Configure custom domain

### Option 3: Vercel

1. **Import project**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository

2. **Configure**
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (none)
   - Output Directory: ./

3. **Deploy**
   - Click "Deploy"
   - Access at: `project-name.vercel.app`

### Option 4: AWS S3 + CloudFront

1. **Create S3 bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

2. **Enable static website hosting**
   ```bash
   aws s3 website s3://your-bucket-name --index-document index.html
   ```

3. **Upload files**
   ```bash
   aws s3 sync . s3://your-bucket-name --exclude ".git/*"
   ```

4. **Configure CloudFront** (optional, for HTTPS)
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure SSL certificate

## Backend Deployment (Node.js Server)

The backend is needed for full AI chatbot functionality with OpenAI GPT.

### Prerequisites

- Node.js 14+ installed
- npm or yarn
- OpenAI API key
- Backend hosting account

### Option 1: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set OPENAI_API_KEY=your_key_here
   heroku config:set PORT=3000
   heroku config:set CORS_ORIGIN=https://your-frontend-url.com
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

5. **Verify**
   ```bash
   heroku logs --tail
   heroku open
   ```

### Option 2: Railway

1. **Sign up at [railway.app](https://railway.app)**

2. **Create new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose repository

3. **Configure**
   - Add environment variables:
     - `OPENAI_API_KEY`
     - `CORS_ORIGIN`
     - `PORT` (Railway auto-assigns)

4. **Deploy**
   - Railway auto-deploys on push
   - Get deployment URL from dashboard

### Option 3: DigitalOcean App Platform

1. **Create account at [digitalocean.com](https://www.digitalocean.com)**

2. **Create App**
   - Apps → Create App
   - Connect GitHub repository
   - Select branch

3. **Configure**
   - App Spec:
     ```yaml
     name: ai-chatbot-backend
     services:
     - name: api
       environment_slug: node-js
       github:
         repo: your-username/your-repo
         branch: main
         deploy_on_push: true
       run_command: node server.js
       envs:
       - key: OPENAI_API_KEY
         value: your_key_here
         type: SECRET
       - key: CORS_ORIGIN
         value: https://your-frontend.com
     ```

4. **Deploy**
   - Click "Create Resources"
   - App URL: `app-name.ondigitalocean.app`

### Option 4: Self-Hosted (VPS)

1. **Connect to server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone repository**
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create .env file**
   ```bash
   cat > .env << EOF
   PORT=3000
   OPENAI_API_KEY=your_key_here
   CORS_ORIGIN=https://your-frontend.com
   NODE_ENV=production
   EOF
   ```

6. **Install PM2 (process manager)**
   ```bash
   sudo npm install -g pm2
   ```

7. **Start server**
   ```bash
   pm2 start server.js --name chatbot-api
   pm2 save
   pm2 startup
   ```

8. **Configure Nginx (reverse proxy)**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

## Configuration

### Frontend Configuration

Update `js/api-integration.js`:

```javascript
const API_CONFIG = {
    baseURL: 'https://your-backend-url.com/api',
    // or for development:
    // baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    retryAttempts: 3
};
```

### Backend Configuration

Create `.env` file:

```env
# Server
PORT=3000
NODE_ENV=production

# OpenAI
OPENAI_API_KEY=sk-your-api-key-here

# CORS
CORS_ORIGIN=https://your-frontend-url.com

# Database (optional)
DATABASE_URL=mongodb://localhost:27017/chatbot

# Email (optional, for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Environment Variables

### Required
- `OPENAI_API_KEY` - Your OpenAI API key
- `CORS_ORIGIN` - Frontend URL (for CORS)

### Optional
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - Database connection string
- `SMTP_*` - Email configuration

## Post-Deployment

### 1. Update Frontend API Endpoint

In `js/api-integration.js`:
```javascript
const API_CONFIG = {
    baseURL: 'https://your-backend-domain.com/api',
    // ...
};
```

### 2. Test Endpoints

```bash
# Health check
curl https://your-backend.com/health

# Test chat endpoint
curl -X POST https://your-backend.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "sessionId": "test-123"}'
```

### 3. Monitor Logs

```bash
# Heroku
heroku logs --tail

# Railway
railway logs

# PM2 (self-hosted)
pm2 logs chatbot-api
```

### 4. Set Up Monitoring

- **Uptime monitoring**: Use UptimeRobot or Pingdom
- **Error tracking**: Sentry or LogRocket
- **Analytics**: Google Analytics for frontend

## Troubleshooting

### CORS Errors

Ensure `CORS_ORIGIN` is set correctly:
```javascript
app.use(cors({ 
    origin: process.env.CORS_ORIGIN || '*' 
}));
```

### OpenAI API Errors

- Check API key is valid
- Verify billing is set up
- Monitor rate limits

### Voice Input Not Working

- Requires HTTPS (except localhost)
- Only works in Chrome/Edge
- Check microphone permissions

### File Upload Issues

- Verify file size limits (5MB default)
- Check MIME types allowed
- Ensure proper error handling

## Security Best Practices

1. **HTTPS Only**
   - Use SSL certificates (Let's Encrypt)
   - Redirect HTTP to HTTPS

2. **Environment Variables**
   - Never commit `.env` files
   - Use platform secret management

3. **Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

4. **Input Validation**
   - Sanitize user inputs
   - Validate file uploads
   - Use parameterized queries

5. **API Key Security**
   - Rotate keys regularly
   - Monitor usage
   - Set spending limits

## Cost Optimization

### OpenAI API

- Use GPT-3.5-turbo (cheaper than GPT-4)
- Set `max_tokens` limit (default: 500)
- Implement response caching
- Monitor usage dashboard

### Hosting

- Start with free tiers:
  - GitHub Pages: Free
  - Netlify: Free tier available
  - Heroku: Free tier (with limitations)
- Scale as needed

## Maintenance

### Regular Tasks

1. **Update Dependencies**
   ```bash
   npm update
   npm audit fix
   ```

2. **Monitor API Usage**
   - Check OpenAI usage dashboard
   - Review costs monthly

3. **Backup Data**
   - Export session data
   - Backup conversation logs

4. **Performance Monitoring**
   - Check response times
   - Monitor error rates
   - Review user feedback

## Support

For deployment issues:
- Check CHATBOT_README.md
- Review server logs
- Contact: info@aisolutions.com

---

**Last Updated**: December 2024
