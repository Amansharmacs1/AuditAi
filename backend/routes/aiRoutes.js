const express = require("express");
const router = express.Router();
const Audit = require("../models/Audit"); // ✅ REQUIRED
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/generate", async (req, res) => {
  try {
    const { tools } = req.body;

    if (!tools || tools.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No tools provided",
      });
    }

    // ✅ enrich tools first
    const enrichedTools = tools.map((t) => ({
      ...t,
      totalCost: t.cost * t.seats,
    }));

    const { runAuditEngine } = require("../utils/auditEngine");
    const { recommendations, totalSavings } = runAuditEngine(enrichedTools);
    const totalSpend = enrichedTools.reduce((s,t) => s + t.totalCost, 0);

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
Focus on the most impactful optimization (e.g., if they are wasting a lot on unused seats, point it out. If they are paying retail for multiple LLMs, mention consolidation). 
Maintain a professional, encouraging, and advisory tone. If their savings are very low (< $100), commend them for having a highly optimized stack.`;

    let summary = `Audit complete. We analyzed your stack and found $${totalSavings} in potential monthly savings. Review the detailed tool breakdown below for specific downgrade and consolidation opportunities to optimize your digital supply chain.`;
    if (totalSavings < 100) {
      summary = `Audit complete. Your SaaS stack is highly optimized. We found minimal waste ($${totalSavings}/mo), indicating excellent seat management and plan selection. Keep up the great work!`;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 1.0,
            }
          }),
        }
      );
      const data = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) summary = aiText;
    } catch (e) {
      console.error("LLM Generation failed, using fallback summary");
    }

    // ✅ SAVE TO DB (FIXED)
    const newAudit = new Audit({
      userEmail: req.user.email,
      tools: enrichedTools,
      summary: summary,
      recommendations: recommendations,
      totalSavings: totalSavings
    });

    const saved = await newAudit.save();

    // ✅ RETURN RESPONSE
    return res.json({
      success: true,
      summary,
      data: saved,
    });

  } catch (err) {
    console.error("Gemini Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
router.get("/latest", async (req, res) => {
  try {

    const latest = await Audit.findOne({
      userEmail: req.user.email,
    }).sort({
      createdAt: -1,
    });

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: "No audits found",
      });
    }

    res.json({
      success: true,
      data: latest,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
});
module.exports = router;