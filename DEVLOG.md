## Day 1 — 2026-05-06
**Hours worked:** 2

**What I did:**  
Started setting up the project and finalized the idea flow for the AI audit platform. Installed the required dependencies for both frontend and backend, configured the project folders, and explored Gemini API documentation. Also worked on the initial tool selection input UI.

**What I learned:**  
Learned how Gemini API setup works and how environment variables are managed in a MERN project.

**Blockers / what I'm stuck on:**  
Had some confusion while configuring the Gemini API and understanding the response structure initially.

**Plan for tomorrow:**  
Work on the form functionality, connect backend APIs, and start saving audit data in MongoDB.

---

## Day 2 — 2026-05-07
**Hours worked:** 5

**What I did:**  
Worked on the dynamic form section where users can add multiple tools with plans, costs, and seats. Connected the frontend with backend APIs and created MongoDB routes/models for storing audits. Also started integrating Gemini AI responses and worked on the result page UI.

**What I learned:**  
Got a better understanding of handling dynamic React state and API calls between frontend and backend.

**Blockers / what I'm stuck on:**  
AI responses were coming in large paragraphs, so formatting them properly inside the UI took some time.

**Plan for tomorrow:**  
Improve the result page formatting and start adding login/authentication functionality.

---

## Day 3 — 2026-05-08

**Hours worked:** 5

**What I did:**  
Worked on improving the overall project flow and user authentication. Added email-based login functionality with verification flow and protected routes so only logged-in users can access the main pages. Also connected audits with user emails so every user can view only their own audit history. Improved form validation and fixed issues where audits were not saving correctly in MongoDB. Updated the result page UI by separating AI responses into sections like summary, cost-saving suggestions, and alternative tools instead of showing one large paragraph.

**What I learned:**  
Learned how protected routes work in React and how to manage user sessions using localStorage. Also understood how to connect frontend authentication flow with backend APIs and MongoDB models. Got better understanding of debugging API validation issues and handling async requests properly.

**Blockers / what I'm stuck on:**  
Faced issues with Gemini API keys becoming invalid and MongoDB connection failing sometimes. Also had trouble with required fields in Mongoose validation while saving user-specific audits.

**Plan for tomorrow:**  
Improve the home page UI to make it look more modern and interactive. Add better dashboard visuals, animations, and polish the overall user experience.

---

## Day 4 — 2026-05-09

**Hours worked:** 6

**What I did:**
Focused mainly on improving the frontend experience and making the project feel more polished overall. Redesigned parts of the home page UI with better layouts, gradients, hover effects, and cleaner sections to make the platform look more modern. Added lead capture functionality before showing audit results and connected it with backend storage. Also worked on generating public shareable audit links and started building the public result page where users can share their optimization reports. Improved the audit calculation logic to make savings recommendations more realistic and business-oriented instead of overly aggressive AI-generated outputs.

**What I learned:**
Learned how public/private audit sharing flows work and how to safely expose audit data without leaking sensitive user information. Also got better understanding of conditional rendering, reusable UI components, and improving user experience through frontend design patterns.

**Blockers / what I'm stuck on:**
Faced issues with package imports and dependency conflicts while integrating new UI components. Also spent time debugging some incorrect savings calculations and unrealistic AI recommendations.

**Plan for tomorrow:**
Complete the shareable audit page flow, improve responsiveness for mobile devices, and add final polish like loading states, animations, and better error handling across the app.
