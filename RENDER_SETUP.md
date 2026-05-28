# Render Deployment Guide – Contacts API

## Problem
Swagger UI was showing `http://localhost:3000` in production (Render), causing CORS errors and failed API requests.

## Solution
The app now dynamically sets Swagger server URL based on the environment using `process.env.NODE_ENV`.

## How It Works

### Local Development
```
NODE_ENV = (not set, or 'development')
Swagger shows: http://localhost:3000
```

### Production on Render
```
NODE_ENV = 'production'
Swagger shows: https://contactsdb-o4ps.onrender.com
```

## Required Render Environment Variables

**SET THESE in your Render service settings:**

1. **NODE_ENV** (REQUIRED)
   ```
   NODE_ENV=production
   ```
   This ensures the app uses production settings and doesn't load the local .env file.

2. **BASE_URL** (REQUIRED)
   ```
   BASE_URL=https://contactsdb-o4ps.onrender.com
   ```
   Replace with your actual Render URL. Alternatively, Render provides `RENDER_EXTERNAL_URL` automatically.

3. **MONGODB_URI** (REQUIRED)
   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/?appName=<app>
   ```
   Your MongoDB Atlas connection string.

### Optional
- `SESSION_SECRET` – Secure session secret (generated or provided)
- `CLIENT_URL` – URL of your frontend (for CORS)

## Step-by-Step Deployment

1. **Ensure .env is NOT committed**
   - `.env` is already in `.gitignore`
   - Verify: `git status` should not show `.env`

2. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Fix Swagger server URL and prepare for production"
   git push origin main
   ```

3. **Create/Update Render Service**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Select Branch: `main`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables in Render Dashboard**
   - Go to **Settings** → **Environment**
   - Add each required variable:
     - `NODE_ENV=production`
     - `BASE_URL=https://contactsdb-o4ps.onrender.com`
     - `MONGODB_URI=<your connection string>`

5. **Deploy**
   - Render will auto-deploy on push to main
   - Or manually trigger deployment in dashboard

6. **Test Swagger on Render**
   - Navigate to: `https://contactsdb-o4ps.onrender.com/api-docs`
   - Verify Swagger shows the Render URL (not localhost)
   - Test "Try it out" on any endpoint
   - Should work without CORS errors

## Troubleshooting

### Swagger Still Shows Localhost
- Check Render dashboard: is `NODE_ENV=production` set?
- Verify logs show: `Swagger server set to: https://...`
- Restart the service

### "Failed to fetch" CORS Error
- Ensure `NODE_ENV=production` is set
- Verify `BASE_URL` matches your Render URL
- Check CORS origin in server.js uses `baseUrl`

### API Requests Fail
- Verify `MONGODB_URI` is correct and has network access from Render
- Check MongoDB Atlas allows Render IPs (or use "Allow All")
- See Render logs for connection errors

## Code Changes Made

### server.js
```javascript
// Detects production vs development
const isProduction = process.env.NODE_ENV === 'production';

// Selects correct Swagger server URL
const prodUrl = process.env.BASE_URL || process.env.RENDER_EXTERNAL_URL || 'https://contactsdb-o4ps.onrender.com';
const baseUrl = isProduction ? prodUrl : `http://localhost:${port}`;

// Sets Swagger servers dynamically
swaggerDocument.servers = isProduction
  ? [{ url: prodUrl, description: 'Production server' }]
  : [{ url: baseUrl, description: 'Local development server' }];
```

### swagger.json
- Removed hardcoded `servers` array (was static)
- Server URL now set at runtime by server.js

## Local Development

To test locally:

```bash
# Install dependencies
npm install

# Start dev server (uses localhost:3000)
npm run dev

# Or with nodemon:
npm run dev

# Navigate to:
# http://localhost:3000/api-docs
```

Swagger will show `http://localhost:3000` locally and will work with local requests.

## Summary

| Environment | NODE_ENV | Swagger URL | Deployed |
|---|---|---|---|
| Local | (not set) | http://localhost:3000 | Your machine |
| Render | production | https://contactsdb-o4ps.onrender.com | Cloud |

**The key:** Set `NODE_ENV=production` on Render so the app knows to use production settings and not load the local .env file.
