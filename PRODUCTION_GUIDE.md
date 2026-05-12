# 🎯 AuditAI - Complete Production Deployment Guide

## Overview
AuditAI is deployed across two platforms:
- **Backend**: Render (Node.js/Express)
- **Frontend**: Vercel (React/Vite)

---

## 🔧 Production Environment Variables

### Render Backend
Set these environment variables in your Render dashboard:

```env
PORT=8080
MONGO_URI=mongodb+srv://amansharmacs11_db_user:DmrAmBu5OYkDkJIr@cluster0.oxwc0zh.mongodb.net/?appName=Cluster0
GEMINI_API_KEY=AIzaSyD1R8RX_q4lqpwC8AKOUxRCVdt6P1SIOEM
EMAIL_USER=buildwithamansharma@gmail.com
EMAIL_PASS=fppw fshy pefd emmw
JWT_SECRET=vsldkjnfffsbdbbgbgnfxben
FRONTEND_URL=https://audit-ai-nu.vercel.app
NODE_ENV=production
```

### Vercel Frontend
- No environment variables needed
- Frontend configuration is hardcoded to use Render backend at `https://auditai-khcp.onrender.com`

---

## 📋 Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Vercel (Frontend)                 │
│             https://audit-ai-nu.vercel.app          │
│                                                     │
│  - React + Vite SPA                                │
│  - Session-based authentication                     │
│  - PDF export functionality                         │
└──────────────────┬──────────────────────────────────┘
                   │ CORS + API Calls
                   │
┌──────────────────▼──────────────────────────────────┐
│                 Render (Backend)                    │
│          https://auditai-khcp.onrender.com          │
│                                                     │
│  - Express.js REST API                             │
│  - JWT token-based auth                            │
│  - MongoDB integration                             │
│  - Email notifications (Gmail)                     │
│  - Gemini AI integration                           │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
    ┌───▼──┐  ┌───▼──┐  ┌───▼──┐
    │ MongoDB │  │Gmail │  │Gemini│
    │ Atlas  │  │SMTP  │  │ API  │
    └────────┘  └──────┘  └──────┘
```

---

## 🔐 Security Features

✅ **CORS Protection**: Configured to accept only Vercel and localhost
✅ **Rate Limiting**: Max 5 lead captures per IP per 15 minutes
✅ **Honeypot Field**: Spam bot detection
✅ **JWT Authentication**: 5-minute session tokens
✅ **Token Verification**: Email verification tokens (10 minutes)
✅ **Password Reset**: Secure reset tokens (10 minutes)
✅ **PII Protection**: Shared audits strip sensitive information

---

## 📧 Email Flow

### 1. Login Verification
```
User enters email → Backend sends JWT token → User clicks link in email → 
Token verified → Session created → User logged in
```

### 2. Password Reset
```
User clicks "Forgot Password" → Email with reset link sent →
User clicks link → Sets new password → Token verified → Password updated
```

### 3. Audit Confirmation
```
User submits audit → Lead created → Audit generated → 
Email sent with public share link → User receives link
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All environment variables added to Render
- [ ] FRONTEND_URL set to `https://audit-ai-nu.vercel.app`
- [ ] MongoDB URI updated in Render
- [ ] JWT_SECRET set in Render
- [ ] Email credentials verified
- [ ] Gemini API key verified

### Post-Deployment
- [ ] Test backend health: `https://auditai-khcp.onrender.com/`
- [ ] Test CORS by accessing frontend
- [ ] Test login flow with email verification
- [ ] Test password reset flow
- [ ] Test audit generation and email sending
- [ ] Test public audit sharing
- [ ] Check Render logs for errors
- [ ] Monitor email delivery

---

## 🐛 Troubleshooting

### Issue: CORS Error in Browser Console
**Solution:**
1. Verify `FRONTEND_URL` on Render is `https://audit-ai-nu.vercel.app`
2. Check that backend is running on Render
3. Restart Render service

### Issue: Emails Not Received
**Solution:**
1. Check Gmail app password (not regular password)
2. Enable "Less secure app access" if needed
3. Check Render logs: `sendAuditConfirmationEmail error`
4. Verify email configuration in `.env`

### Issue: Database Connection Failed
**Solution:**
1. Verify MongoDB URI is correct
2. Check IP whitelist in MongoDB Atlas (should allow all IPs for Render)
3. Test connection locally first
4. Check Render logs for connection errors

### Issue: Authentication Token Expired
**Solution:**
1. Tokens are valid for only 5 minutes
2. User needs to verify email again
3. Reset tokens are valid for 10 minutes
4. Clear browser cookies and try again

### Issue: Gemini API Not Working
**Solution:**
1. Verify API key is correct
2. Check API quota on Google Cloud Console
3. Ensure API is enabled
4. Backend uses fallback summary if Gemini fails

---

## 📊 Monitoring

### Key Metrics to Monitor
- Render uptime
- API response times
- Email delivery rate
- Database connection status
- Error rates in logs

### Render Logs
View logs in Render dashboard:
1. Go to your service
2. Click "Logs" tab
3. Watch for errors starting with:
   - `MongoDB Error`
   - `Email send failed`
   - `LLM Generation failed`
   - `Lead Create Error`

---

## 🔄 Deployment Updates

### To Deploy New Changes:

**Backend (Render):**
1. Commit changes to GitHub
2. Render auto-deploys from main branch
3. Monitor deployment in Render dashboard
4. Verify no errors in logs

**Frontend (Vercel):**
1. Commit changes to GitHub
2. Vercel auto-deploys from main branch
3. Monitor deployment in Vercel dashboard
4. Test at `https://audit-ai-nu.vercel.app`

---

## 📞 Support

### Common Issues Resolution
1. Check Render logs first
2. Verify all environment variables
3. Test with Postman/cURL if needed
4. Check browser DevTools Network tab
5. Review error messages in logs

### Files to Check
- `backend/.env` - Environment variables
- `backend/server.js` - CORS configuration
- `frontend/src/utils/apiConfig.js` - API endpoints
- Render dashboard logs
- MongoDB Atlas logs

---

## ✨ Production Readiness Checklist

✅ Backend API secured with JWT
✅ Frontend protected with authenticated routes
✅ CORS properly configured
✅ Email notifications working
✅ Database connection pooling
✅ Error handling and logging
✅ Rate limiting enabled
✅ Environment variables documented
✅ Deployment documentation complete
✅ Monitoring in place

---

**Status**: 🟢 Production Ready
**Last Updated**: May 12, 2026
**Frontend**: https://audit-ai-nu.vercel.app
**Backend**: https://auditai-khcp.onrender.com
