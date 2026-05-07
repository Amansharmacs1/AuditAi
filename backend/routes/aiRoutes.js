const express = require("express");
const router = express.Router();
const Audit = require("../models/Audit"); // ✅ REQUIRED

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

    const prompt = `
You are a SaaS cost optimization expert.

Analyze these tools:
${JSON.stringify(enrichedTools)}

Return:
- A short summary paragraph
- Cost saving suggestions
- Alternative cheaper tools
`;

    // ✅ Gemini API call
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("GEMINI FULL RESPONSE:");
console.log(JSON.stringify(data, null, 2));
    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No AI response";

    // ✅ SAVE TO DB (FIXED)
    const newAudit = new Audit({
      tools: enrichedTools,
      summary: summary,
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

    const latest = await Audit.findOne().sort({
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