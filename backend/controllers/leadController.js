const Lead = require("../models/Lead");
const Audit = require("../models/Audit");
const { runAuditEngine } = require("../utils/auditEngine");
const { sendAuditConfirmationEmail } = require("../utils/emailService");

// In CommonJS, nanoid is an ESM module in versions > 3. 
// We are using nanoid@3.3.7 so we can require it synchronously.
const { nanoid } = require("nanoid");

/**
 * Creates a new lead, runs the audit engine, generates AI summary,
 * saves to DB, and sends confirmation email.
 */
exports.createLead = async (req, res) => {
  try {
    const { fullName, userEmail, companyName, role, teamSize, tools, bot_field } = req.body;

    // 🛡️ ABUSE PROTECTION: Honeypot Check
    // If bot_field is filled, it's likely an automated bot scraping the form.
    if (bot_field && bot_field.length > 0) {
      console.warn(`Honeypot triggered by IP: ${req.ip}`);
      // Return 200 to fool the bot into thinking it succeeded.
      return res.status(200).json({ success: true, message: "Audit generated." });
    }

    if (!fullName || !userEmail || !tools || tools.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required fields or tools." });
    }

    // 1. Enrich Tools
    const enrichedTools = tools.map((t) => ({
      ...t,
      totalCost: t.cost * t.seats,
    }));

    // 2. Run Audit Engine
    const { recommendations, totalSavings } = runAuditEngine(enrichedTools);
    const totalSpend = enrichedTools.reduce((s, t) => s + t.totalCost, 0);

    // 3. Generate AI Summary (Graceful fallback if fails)
    let aiSummary = `Audit complete. We analyzed your stack and found $${totalSavings} in potential monthly savings. Review the detailed tool breakdown below for specific downgrade and consolidation opportunities to optimize your digital supply chain.`;
    if (totalSavings < 100) {
      aiSummary = `Audit complete. Your SaaS stack is highly optimized. We found minimal waste ($${totalSavings}/mo), indicating excellent seat management and plan selection. Keep up the great work!`;
    }

    const prompt = `You are a SaaS cost optimization expert.

Analyze the following audit results for a user's digital supply chain:
Total Monthly Spend: $${totalSpend}
Total Monthly Savings Found: $${totalSavings}
Tools:
${JSON.stringify(enrichedTools, null, 2)}
Recommendations:
${JSON.stringify(recommendations, null, 2)}

Write a highly personalized, completely unique, and exactly ~100-word executive summary paragraph for the user. 
This is a brand new audit request, so ensure your summary text is completely different from previous summaries and reflects their exact numbers: Total Spend $${totalSpend} and Total Savings $${totalSavings}.
Do not use bullet points or lists. Write a single flowing paragraph.
Focus on the most impactful optimization. Maintain a professional, encouraging, and advisory tone. If their savings are very low (< $100), commend them for having a highly optimized stack.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 1.0 },
          }),
        }
      );
      const data = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) aiSummary = aiText;
    } catch (e) {
      console.error("LLM Generation failed, using fallback summary", e.message);
    }

    // 4. Generate Share ID
    const publicShareId = nanoid(10); // e.g., 'V1StGXR8_Z'

    // 5. Save Lead
    const newLead = new Lead({
      userEmail,
      fullName,
      companyName,
      role,
      teamSize,
      tools: enrichedTools,
      totalSpend,
      totalSavings,
      recommendations,
      aiSummary,
      publicShareId,
    });

    await newLead.save();

    // 5.5 Save Audit for history
    try {
      const newAudit = new Audit({
        userEmail: userEmail.toLowerCase().trim(),
        tools: enrichedTools,
        summary: aiSummary,
        recommendations: recommendations || [],
        totalSavings: totalSavings || 0,
      });
      await newAudit.save();
      console.log(`✅ Audit saved to history for ${userEmail}`);
    } catch (auditErr) {
      console.error("❌ Failed to save audit to history:", auditErr.message);
      // We continue because the lead was already saved
    }

    // 6. Send Email Notification
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, "");
    const publicShareUrl = `${frontendUrl}/share/${publicShareId}`;
    
    try {
      console.log(`📧 Sending audit result email to ${userEmail}...`);
      await sendAuditConfirmationEmail(userEmail, fullName, totalSavings, publicShareUrl);
    } catch (err) {
      console.error("❌ Email send failed during lead creation:", err.message);
    }

    return res.status(201).json({
      success: true,
      publicShareId,
      message: "Lead captured and audit generated successfully."
    });

  } catch (error) {
    console.error("❌ Lead Create Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Gets the audit details by its public share ID.
 * Strips out PII (email, name, company) before returning.
 */
exports.getSharedAudit = async (req, res) => {
  try {
    const { shareId } = req.params;

    const lead = await Lead.findOne({ publicShareId: shareId });
    if (!lead) {
      return res.status(404).json({ success: false, message: "Audit not found." });
    }

    // Strip out PII
    const safeData = {
      tools: lead.tools,
      totalSpend: lead.totalSpend,
      totalSavings: lead.totalSavings,
      recommendations: lead.recommendations,
      aiSummary: lead.aiSummary,
      createdAt: lead.createdAt,
    };

    return res.json({ success: true, data: safeData });
  } catch (error) {
    console.error("Get Shared Audit Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
