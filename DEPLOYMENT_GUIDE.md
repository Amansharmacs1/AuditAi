# 🚀 Deployment Checklist - Vercel + Render

## ✅ Backend (Render) - Deployment Ready

### Environment Variables to Set on Render:
```
PORT=8080
MONGO_URI=mongodb+srv://amansharmacs11_db_user:DmrAmBu5OYkDkJIr@cluster0.oxwc0zh.mongodb.net/?appName=Cluster0
GEMINI_API_KEY=AIzaSyD1R8RX_q4lqpwC8AKOUxRCVdt6P1SIOEM
EMAIL_USER=buildwithamansharma@gmail.com
EMAIL_PASS=fppw fshy pefd emmw
JWT_SECRET=vsldkjnfffsbdbbgbgnfxben
FRONTEND_URL=https://audit-ai-nu.vercel.app
NODE_ENV=production
```

### Critical Backend Fixes Applied:
- ✅ CORS configured to accept `https://audit-ai-nu.vercel.app`
- ✅ CORS also accepts localhost for development
- ✅ Email verification links use `FRONTEND_URL` environment variable
- ✅ Password reset links use `FRONTEND_URL` environment variable
- ✅ Audit share URLs use `FRONTEND_URL` environment variable
- ✅ Database connection properly configured
- ✅ JWT authentication middleware in place
- ✅ Rate limiting on lead capture endpoint

### Backend Endpoints Available:
```
POST /api/auth/send-link - Send login verification
POST /api/auth/verify - Verify token and create session
POST /api/auth/login-password - Login with password
POST /api/auth/set-password - Set password
POST /api/auth/forgot-password - Send reset password link
POST /api/auth/reset-password - Reset password with token
POST /api/leads/create - Create lead and generate audit
GET /api/leads/share/:shareId - Get shared audit
POST /api/ai/generate - Generate audit (authenticated)
GET /api/ai/latest - Get latest audit (authenticated)
GET /api/audit/history/:email - Get audit history (authenticated)
DELETE /api/audit/:id - Delete audit (authenticated)
```

---

## ✅ Frontend (Vercel) - Deployment Ready

### Frontend Configuration:
- ✅ Backend API URL points to `https://auditai-khcp.onrender.com`
- ✅ Centralized API configuration in `src/utils/apiConfig.js`
- ✅ All API endpoints use the centralized config
- ✅ No hardcoded localhost URLs
- ✅ Session management with JWT tokens
- ✅ Protected routes configured

### Frontend Features Working:
- ✅ Login/Signup flow
- ✅ Email verification
- ✅ Password reset
- ✅ Audit generation
- ✅ Audit history
- ✅ Public audit sharing
- ✅ PDF export

---

## 📋 Deployment Steps

### Step 1: Backend Deployment on Render
1. Go to https://dashboard.render.com
2. Create new Web Service
3. Connect to your GitHub repository
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Add environment variables (see above)
7. Deploy

### Step 2: Frontend Deployment on Vercel
1. Go to https://vercel.com
2. Import your GitHub repository
3. Framework: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy

### Step 3: Verify Deployment
1. Backend health check: `https://auditai-khcp.onrender.com/`
2. Frontend URL: `https://audit-ai-nu.vercel.app/`
3. Try signup/login flow
4. Check email functionality
5. Test audit generation

---

## 🔍 Troubleshooting

### Email Not Sending:
- Check `EMAIL_USER` and `EMAIL_PASS` are correct on Render
- Verify Gmail app password (not regular password)
- Check email logs in backend console

### CORS Errors:
- Verify `FRONTEND_URL` is set correctly on Render
- Should be: `https://audit-ai-nu.vercel.app`
- Check browser console for exact error

### Authentication Issues:
- Verify `JWT_SECRET` is set on Render
- Check token expiry (5 minutes for session, 10 minutes for verify/reset)
- Clear browser cookies and try again

### Database Connection Issues:
- Verify `MONGO_URI` is correct
- Check IP whitelist on MongoDB Atlas
- Test with MongoDB Atlas UI

### Gemini API Issues:
- Verify `GEMINI_API_KEY` is valid
- Check API quota on Google Cloud Console
- Test with a simple prompt

---

## 📝 Files Modified for Production

1. `backend/.env` - Added FRONTEND_URL
2. `backend/server.js` - Updated CORS configuration
3. `backend/routes/authRoutes.js` - Updated email links
4. `backend/controllers/leadController.js` - Updated share URLs
5. `frontend/src/utils/apiConfig.js` - Centralized API config
6. `render.yaml` - Render deployment configuration

---

## 🎯 Final Status

✅ **Ready for Production**
- All URLs configured correctly
- CORS properly set up
- Email functionality implemented
- Error handling in place
- Rate limiting enabled
- Secure token-based authentication
