# Email Functionality - Production Deployment Fix

## Issue
After deploying backend to Render and frontend to Vercel, email links were broken because:
1. CORS was hardcoded to `http://localhost:5173`
2. Email verification/reset/share links were hardcoded to `http://localhost:5173`

## Solution
Updated backend to use environment variables for all frontend URLs.

## Required Environment Variables on Render

Set these on your Render backend dashboard:

```
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

For example:
```
FRONTEND_URL=https://auditai.vercel.app
```

### How to set environment variables on Render:
1. Go to your Render service dashboard
2. Click "Environment" tab
3. Add new environment variables:
   - `FRONTEND_URL` = your Vercel URL
   - `MONGO_URI` = your MongoDB connection string
   - `JWT_SECRET` = your secret key
   - `EMAIL_USER` = your Gmail address
   - `EMAIL_PASS` = your Gmail app password
   - `GEMINI_API_KEY` = your Gemini API key

## Testing
1. Deploy the backend changes to Render
2. Update `FRONTEND_URL` environment variable on Render to your Vercel URL
3. Test email functionality:
   - Sign up with an email
   - Check if verification link works
   - Check if forgot password link works
   - Check if audit share links work

## CORS Configuration
The backend now automatically accepts:
- `http://localhost:5173` (development)
- `http://localhost:3000` (alternative dev)
- Any URL specified in `FRONTEND_URL` environment variable (production)

## Files Modified
- `backend/server.js` - Updated CORS configuration
- `backend/routes/authRoutes.js` - Updated verification and reset links
- `backend/controllers/leadController.js` - Updated share URL
- `backend/.env.example` - Added documentation
