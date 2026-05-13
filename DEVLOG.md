## Day 1 — 2026-05-07
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

## Day 2 — 2026-05-08
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

## Day 3 — 2026-05-09

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

## Day 4 — 2026-05-10

**Hours worked:** 6

**What I did:**  
Focused mainly on improving the frontend experience and making the project feel more polished overall. Redesigned parts of the home page UI with better layouts, gradients, hover effects, and cleaner sections to make the platform look more modern. Added lead capture functionality before showing audit results and connected it with backend storage. Also worked on generating public shareable audit links and started building the public result page where users can share their optimization reports.

**What I learned:**  
Learned how public/private audit sharing flows work and how to safely expose audit data without leaking sensitive user information. Also got better understanding of conditional rendering and reusable frontend components.

**Blockers / what I'm stuck on:**  
Faced dependency conflicts while integrating new UI packages and spent time fixing some incorrect savings calculations from AI-generated responses.

**Plan for tomorrow:**  
Improve authentication flow further and polish protected route handling across the application.

---

## Day 5 — 2026-05-11

**Hours worked:** 2

**What I did:**  
Focused on polishing and improving the authentication system. Improved login and signup flow, fixed protected route issues, and tested session persistence across refreshes. Also cleaned up backend auth logic and improved validation handling for unauthorized access.

**What I learned:**  
Learned more about managing authentication state in React and handling token/session-based access flow between frontend and backend.

**Blockers / what I'm stuck on:**  
Faced some issues with route redirection and localStorage session handling during logout/login transitions.

**Plan for tomorrow:**  
Work on final project testing, responsiveness improvements, and overall UI cleanup.

---

## Day 6 — 2026-05-12

**Hours worked:** 3

**What I did:**  
Worked on final testing and fixing small bugs across the application. Improved mobile responsiveness, cleaned up some UI inconsistencies, optimized API handling, and tested complete user flows from signup to audit generation and public sharing. Also improved error handling and loading states.

**What I learned:**  
Learned how small UI and UX improvements significantly improve the overall feel of a product. Also got more comfortable debugging frontend/backend integration issues.

**Blockers / what I'm stuck on:**  
Had occasional issues with API deployment environment variables and MongoDB connection stability during testing.

**Plan for tomorrow:**  
Finalize deployment and prepare project documentation files.

---

## Day 7 — 2026-05-13

**Hours worked:** 4

**What I did:**  
Finalized deployment of both frontend and backend applications using Vercel and Render. Completed all required documentation files including README, architecture notes, pricing logic, and reflection documents. Tested production deployment links, verified APIs, and cleaned up the repository structure before final submission.

**What I learned:**  
Learned more about deployment workflows, environment variable management in production, and final-stage project optimization/testing.

**Blockers / what I'm stuck on:**  
Faced some deployment issues related to environment variables and API keys initially, but resolved them after debugging production configs.

**Plan for tomorrow:**  
Project submission and final review.
