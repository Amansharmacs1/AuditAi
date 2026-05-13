# AuditAI 🚀

 **Stop overpaying for your AI stack.** AuditAI helps startups and small teams analyze their subscription spend and reclaim their budget.

AuditAI is a spend optimization platform designed to shine a light on the "shadow stack" of AI tools. By auditing subscriptions like **ChatGPT, Claude, Gemini, Cursor, and GitHub Copilot**, we identify redundancies and generate actionable, AI-powered recommendations to keep your team productive without the waste[cite: 1, 2].

Designed as a lead-generation tool, AuditAI bridges the gap between high-performance AI infrastructure and cost-efficiency.

---

## ✨ Key Features

### 🔍 Intelligence & Auditing
* **Spend Audit Engine:** Deep analysis of per-tool costs vs. team utility.
* **AI-Generated Summaries:** Personalized insights powered by Gemini for a human-readable breakdown of your spend.
* **Savings Recommendations:** Specific, tool-by-tool suggestions on where to consolidate.

### 🛡️ Security & Experience
* **Lead Capture & Privacy:** Purpose-built for growth while ensuring public result pages are stripped of identifying user data[cite: 1, 2].
* **Auth & Protected Routes:** Secure access for your team's audit history.
* **PDF Export:** Professional reports ready for stakeholders.

### 🌐 Sharing & Scalability
* **Public Sharing:** Unique, shareable URLs for audit results.
* **Responsive UI:** A modern, clean interface built for speed and clarity[cite: 2].
* **Audit History:** Track your optimization journey over time[cite: 2].

---

## 🛠️ The Tech Stack

AuditAI is built with a modern, high-performance stack for scalability and developer productivity[cite: 2].

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, React Router[cite: 2] |
| **Backend** | Node.js, Express.js[cite: 2] |
| **Database** | MongoDB, Mongoose[cite: 2] |
| **APIs** | Google Gemini (AI Engine), Resend (Email Infrastructure)[cite: 2] |

---

# 🚀 Getting Started

### 📦 1. Clone & Setup
* Run `git clone https://github.com/Amansharmacs1/AuditAi.git` to copy the repository.
* Use `cd AuditAI` to enter the project directory[cite: 2].

### 💻 2. Frontend Installation[cite: 2]
* Navigate to the frontend directory: `cd frontend`[cite: 2].
* Install dependencies: `npm install`[cite: 2].
* Start the development server: `npm run dev`[cite: 2].

### ⚙️ 3. Backend Installation[cite: 2]
* Navigate to the backend directory: `cd backend`[cite: 2].
* Install dependencies: `npm install`[cite: 2].
* Start the backend server: `npm run dev`[cite: 2].

---

# ⚙️ Environment Variables[cite: 2]

* Create a `.env` file in the `backend/` directory[cite: 2].
* `PORT=8080` — The port for your local server[cite: 2].
* `MONGO_URI=your_mongodb_uri` — Your MongoDB connection string[cite: 2].
* `GEMINI_API_KEY=your_gemini_api_key` — Your Google AI API key[cite: 2].
* `JWT_SECRET=your_secret` — The secret key for authentication[cite: 2].
* `RESEND_API_KEY=your_resend_key` — Your key for email services[cite: 2].

---

# 🏗️ Decisions & Trade-offs[cite: 2]

* **Why Gemini?** We prioritized the Gemini API for its seamless integration and high performance during the development lifecycle[cite: 2].
* **Why MongoDB?** The flexible schema of MongoDB was essential for handling dynamic audit data that varies by team size and toolset[cite: 2].
* **Vite vs. Create-React-App:** We used Vite for near-instant hot module replacement (HMR) and a significantly faster build pipeline[cite: 2].
* **Reliability Over Pure AI:** Audit calculations use rule-based logic for financial accuracy, while Gemini is reserved for humanizing the summary. This ensures the numbers are always correct[cite: 1, 2].

---

### # Developed with ❤️ by the AuditAI Team.[cite: 2]