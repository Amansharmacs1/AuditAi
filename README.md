# AuditAI

## Project Overview

AuditAI is a smart AI spend optimization platform built to help startups, freelancers, and teams understand how much they are spending on AI tools and where they can reduce unnecessary costs.

The platform analyzes subscriptions and usage across tools like ChatGPT, Claude, Cursor, Gemini, and GitHub Copilot, then generates an easy-to-understand audit report with potential savings, smarter plan recommendations, and cost optimization insights.

The main goal of AuditAI is to help teams save money on AI infrastructure without affecting productivity.

---

## Features

- Dynamic AI tool spend input form
- AI-generated audit summaries
- Monthly and yearly savings estimation
- Shareable public audit links
- Authentication and protected routes
- Personal audit history dashboard
- Lead capture functionality
- PDF report export
- Fully responsive modern UI

---

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

### AI Integration
- Gemini API

---

## Getting Started

### Frontend Setup

cd frontend
npm install
npm run dev


### Backend Setup


cd backend
npm install
npm run dev


---

## Environment Variables

Create a `.env` file inside the backend folder and add the following variables:


PORT=
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
CLIENT_URL=
EMAIL_USER=
EMAIL_PASS=


---

## Deployment

- Frontend deployed on Vercel
- Backend deployed on Render

---

## Key Decisions & Thought Process

### Why React + Vite?
I used React with Vite because it provides a faster development experience, quick hot reloads, and a cleaner setup compared to traditional React configurations.

### Why MongoDB?
The audit data structure can change frequently depending on tool pricing and recommendations, so MongoDB’s flexible schema was a better fit.

### Why Rule-Based Calculations?
Instead of relying completely on AI for savings calculations, I used rule-based logic to ensure the recommendations stay accurate and consistent.

### Why Authentication?
Authentication was added to support:
- Personal audit history
- Protected routes
- Saved reports for users

Even though it was optional, it improved the overall product experience.

### Separating AI Summary from Calculation Logic
The AI-generated summary is handled separately from the actual savings calculations. This avoids inaccurate financial recommendations from generative AI responses.

---

## How AuditAI Works

1. Users enter their AI tool usage and subscription details.
2. The backend processes and validates the data.
3. A rule-based engine calculates optimization opportunities and estimated savings.
4. Gemini API generates a human-friendly audit summary.
5. The report is stored in the database.
6. Users can revisit, share, or export their reports anytime.

---

## Authentication Flow

- JWT-based authentication
- Protected frontend routes
- Token validation middleware
- Persistent login sessions

---


## Future Improvements

- Team collaboration support
- Real-time AI pricing updates
- Advanced analytics dashboard
- Stripe billing integration
- Multi-workspace support
- SaaS benchmarking system

---

## Author

Aman Sharma

Built as part of the Credex Web Development Internship Assignment.
