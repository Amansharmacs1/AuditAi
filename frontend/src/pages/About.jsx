import React from "react";

const About = () => {
  return (
    <div className="container py-5">
      <div className="card card-custom p-4">

        {/* Title */}
        <h1 className="title mb-3">About AuditAI</h1>

        {/* Tagline */}
        <p className="subtitle">
          Cut unnecessary AI costs in seconds.
        </p>

        <hr />

        {/* REAL LIFE PROBLEM */}
        <h4 className="title mt-3">🚨 Real-Life Problem</h4>
        <p>
          In today’s world, individuals and teams rely heavily on multiple AI tools
          such as ChatGPT, Claude, Gemini, and Copilot. Each tool offers different
          features, pricing plans, and seat-based subscriptions.
        </p>

        <p>
          Over time, this leads to:
        </p>

        <ul>
          <li>Multiple overlapping subscriptions</li>
          <li>Unused or underutilized seats</li>
          <li>Lack of visibility into total AI spending</li>
          <li>Teams paying for tools they no longer actively use</li>
        </ul>

        <p>
          Most users do not track these expenses centrally, resulting in
          <strong> unnecessary monthly costs and inefficient spending</strong>.
        </p>

        <hr />

        {/* WHY THIS IS REAL */}
        <h4 className="title mt-3">🌍 Why This Problem Matters</h4>
        <p>
          With the rapid adoption of AI tools in companies and by individuals,
          monthly SaaS spending is increasing significantly. Even small inefficiencies
          (like paying for unused seats or duplicate tools) can lead to substantial
          financial waste over time.
        </p>

        <p>
          Currently, there is no simple and quick way for users to audit and
          understand their AI-related expenses in one place.
        </p>

        <hr />

        {/* SOLUTION */}
        <h4 className="title mt-3">💡 Our Solution</h4>
        <p>
          AuditAI provides a centralized platform where users can input all their
          AI tool subscriptions, including plan details, costs, and number of seats.
        </p>

        <p>
          It then:
        </p>

        <ul>
          <li>Aggregates all AI tool expenses in one place</li>
          <li>Calculates total monthly spending instantly</li>
          <li>Highlights potential inefficiencies in usage</li>
        </ul>

        <p>
          This allows users to make informed decisions and reduce unnecessary costs.
        </p>

        <hr />

        {/* WHY IT'S A REAL SOLUTION */}
        <h4 className="title mt-3">✅ Why AuditAI is a Real Solution</h4>
        <ul>
          <li>Solves a growing problem in the AI + SaaS ecosystem</li>
          <li>Requires minimal input and gives immediate insights</li>
          <li>Works for individuals, students, startups, and teams</li>
          <li>Encourages cost awareness and better decision-making</li>
        </ul>

        <p>
          Unlike complex financial tools, AuditAI focuses specifically on
          AI tool spending, making it simple, fast, and practical.
        </p>

        <hr />

        {/* HOW IT WORKS */}
        <h4 className="title mt-3">⚙️ How It Works</h4>
        <ol>
          <li>User adds all AI tools they are subscribed to</li>
          <li>Enters cost and number of seats</li>
          <li>AuditAI processes the data</li>
          <li>Displays total spending and structured breakdown</li>
        </ol>

        <hr />

        {/* FUTURE */}
        <h4 className="title mt-3">🚀 Future Scope</h4>
        <ul>
          <li>AI-based suggestions to reduce costs</li>
          <li>Detection of duplicate tools</li>
          <li>Team usage analytics</li>
          <li>Integration with billing systems</li>
        </ul>

        {/* Footer */}
        <div className="mt-4">
          <p className="text-muted small">
            AuditAI is built as a practical solution to a real-world problem,
            combining product thinking with full-stack development.
          </p>
        </div>

      </div>
    </div>
  );
};

export default About;