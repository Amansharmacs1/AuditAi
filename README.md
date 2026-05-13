# AuditAI

AuditAI is an AI-powered SaaS cost optimization platform designed to help startups, students, and growing teams understand how much they’re spending on AI tools and where they can reduce unnecessary costs more efficiently.

The platform analyzes subscriptions like OpenAI ChatGPT, Anthropic Claude, Google Gemini, Cursor, and GitHub Copilot to generate practical optimization suggestions using AI-generated insights.

Built as part of the Credex Web Development Assignment 2026, the project focuses on solving real-world SaaS spending problems while delivering a clean and modern full-stack experience.

---

# Live Demo

* Frontend: https://audit-ai-nu.vercel.app
* Backend API: https://auditai-1.onrender.com
* Repository: https://github.com/Amansharmacs1/AuditAi

---

# Features

## AI Spend Audit Engine

* Analyze spending across multiple AI tools
* Dynamic tool entry system
* Monthly and yearly spend calculations
* Smart optimization suggestions
* AI-generated cost analysis summaries

## AI-Powered Recommendations

* Executive-style summaries
* Budget optimization advice
* Alternative lower-cost tool suggestions
* Structured and readable insights
* Business-focused recommendations

## Authentication System

* Secure email-based authentication
* Protected routes
* Persistent login sessions
* User-specific audit history

## Public Shareable Reports

* Unique public audit URLs
* Share-ready optimization reports
* Sensitive information hidden from public pages
* Public viewing support for results

## Lead Capture System

* Email collection before viewing results
* Optional business details:
  * Company name
  * Role
  * Team size
* Backend lead storage
* Transactional email support

## Modern Frontend Experience

* Responsive UI design
* Smooth navigation flow
* Interactive landing page
* Loading states and animations
* Improved user experience

## Audit History

* Saved audit records
* Persistent history dashboard
* Individual audit result pages

---

# Tech Stack

## Frontend

* React
* Vite
* React Router DOM
* Tailwind CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## APIs & Services

* Gemini API
* Resend Email API

## Deployment

* Vercel (Frontend)
* Render (Backend)

---

# Folder Structure


AuditAI/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── README.md
├── ARCHITECTURE.md
├── DEVLOG.md
├── REFLECTION.md
├── TESTS.md
├── PRICING_DATA.md
├── PROMPTS.md
├── GTM.md
├── ECONOMICS.md
├── USER_INTERVIEWS.md
├── LANDING_COPY.md
├── METRICS.md
└── .env.example


---

# Installation & Setup

## Clone the Repository


git clone https://github.com/Amansharmacs1/AuditAi.git

cd AuditAi


## Backend Setup

cd backend
npm install

Run the backend server:

npm run dev


## Frontend Setup

cd frontend
npm install
npm run dev


---

# Core Workflow

1. User enters AI tools, plans, seat counts, and monthly costs
2. Platform calculates current AI spending
3. Backend sends audit data to Gemini API
4. AI generates optimization recommendations
5. Audit results are stored in MongoDB
6. A public shareable report link is generated
7. Lead details are captured for follow-up

---

# Shareable Audit Links

Every completed audit generates a unique public URL.

The public report:

* Hides sensitive user information
* Displays savings analysis clearly
* Supports public sharing
* Generates cleaner previews for links

---

# Abuse Protection

Basic abuse prevention includes:

* Backend validation
* Rate limiting logic
* Honeypot field checks

This helps reduce spam requests and unnecessary API usage while keeping the experience smooth for genuine users.

---

# Pricing Logic

The platform calculates:

* Total monthly spend
* Total annual spend
* Estimated monthly savings
* Estimated yearly savings

Recommendations are generated using:

* Seat optimization
* Plan downgrade suggestions
* Alternative tool recommendations
* Duplicate subscription detection

---

# Deployment

## Frontend

Deployed using Vercel

## Backend

Deployed using Render

---

# Key Product Decisions

## Why MERN Stack?

The MERN stack made it easier to build and deploy a complete full-stack JavaScript application quickly while keeping development flexible and scalable.

## Why Gemini API?

Gemini offered fast AI responses, flexible recommendation generation, and a solid free-tier experience during development.

## Why Public Audit Links?

Public reports improve product sharing and create a natural growth loop through link sharing.

## Why Lead Capture Before Results?

Capturing leads before showing results helps track conversions and identify users with high optimization potential.

---

# Challenges Faced

* Handling inconsistent AI-generated responses
* Managing protected routes and authentication
* Debugging MongoDB connection issues
* Creating realistic savings calculations
* Structuring AI outputs into readable UI sections

---

# Future Improvements

* Team dashboards
* Advanced analytics
* Stripe billing integration
* Better pricing intelligence
* Real-time SaaS spend tracking
* Vendor comparison engine
* Support for more AI providers

---

# Author

Aman Sharma
Built for the Credex Web Development Assignment 2026.
