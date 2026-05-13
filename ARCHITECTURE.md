# Architecture Overview

AuditAI is built using the MERN stack and follows a clean client-server architecture focused on scalability, simplicity, and smooth user experience.

---

# Frontend

Built with:

* React
* Vite
* Tailwind CSS

## Responsibilities

* User authentication
* Audit form handling
* Displaying AI-generated results
* Public shareable report pages
* Audit history dashboard

The frontend is designed to provide a fast and responsive experience while keeping the interface simple and user-friendly.

---

# Backend

Built with:

* Node.js
* Express.js

## Responsibilities

* API handling
* Authentication
* Gemini AI integration
* Database operations
* Lead capture handling

The backend manages all business logic, AI interactions, data storage, and secure communication between services.

---

# Database

MongoDB is used to store:

* Users
* Audit reports
* Lead information
* Public shareable audit links

MongoDB was chosen because it works efficiently with flexible JSON-based data structures and integrates well with the MERN stack.

---

# AI Integration

Gemini API is used to generate:

* Executive summaries
* Cost-saving suggestions
* Alternative tool recommendations

The backend dynamically creates prompts based on:

* Tool names
* Monthly costs
* Subscription plans
* Number of seats

This allows the platform to generate more contextual and realistic optimization suggestions instead of generic responses.

---

# Shareable Reports

Each completed audit generates a unique public URL.

Public reports:

* Hide sensitive user information
* Display optimization insights and savings
* Can be shared publicly

This feature improves collaboration and also helps create a simple product-sharing loop.

---

# Deployment

* Frontend deployed on Vercel
* Backend deployed on Render

The deployment setup keeps frontend and backend services independent, making updates and scaling easier.

---

# Basic Workflow


User submits audit form
        ↓
Frontend sends data to backend
        ↓
Backend stores audit in MongoDB
        ↓
Gemini API generates recommendations
        ↓
Frontend displays final audit report
