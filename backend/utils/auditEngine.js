/**
 * Hardcoded Audit Engine
 * Evaluates SaaS tools against current pricing data to find exact savings.
 */
function runAuditEngine(tools) {
  let recommendations = [];
  let totalSavings = 0;
  
  // Track tool categories to find overlaps
  let hasChatGPT = false;
  let hasClaude = false;
  let hasGemini = false;
  let hasMidjourney = false;
  let hasCopilot = false;
  let hasCursor = false;

  // First pass: Individual tool plan/seat logic
  tools.forEach((tool) => {
    const tName = tool.tool.toLowerCase();
    const tPlan = tool.plan ? tool.plan.toLowerCase() : "";
    const seats = tool.seats || 1;
    const currentCost = tool.totalCost || (tool.cost * seats);

    if (tName.includes("chatgpt") || tName.includes("openai")) hasChatGPT = true;
    if (tName.includes("claude") || tName.includes("anthropic")) hasClaude = true;
    if (tName.includes("gemini")) hasGemini = true;
    if (tName.includes("midjourney")) hasMidjourney = true;
    if (tName.includes("copilot")) hasCopilot = true;
    if (tName.includes("cursor")) hasCursor = true;

    // 1. ChatGPT Logic
    if (tName.includes("chatgpt")) {
      if (tPlan.includes("team")) {
        if (seats < 2) {
          const newCost = 20 * seats; // Plus plan
          const savings = currentCost - newCost;
          if (savings > 0) {
            totalSavings += savings;
            recommendations.push({
              tool: tool.tool,
              action: "Downgrade to Plus",
              savings: savings,
              reason: "Team plan requires minimum 2 seats and costs $30/mo. You only have 1 user, making the $20/mo Plus plan a better fit."
            });
          }
        }
      } else if (seats >= 10 && (tPlan.includes("plus") || tPlan.includes("team"))) {
        // Credits logic for large teams
        const apiCostEstimate = seats * 10; // estimate $10/mo via API
        const savings = currentCost - apiCostEstimate;
        if (savings > 0) {
          totalSavings += savings;
          recommendations.push({
            tool: tool.tool,
            action: "Switch to API + BYOK UI",
            savings: savings,
            reason: `With ${seats} users, retail ChatGPT is highly inefficient. Switching to OpenAI API with a Bring-Your-Own-Key UI (like TypingMind) and AWS Startup credits can reduce costs by ~50%.`
          });
        }
      }
    }

    // 2. Claude Logic
    if (tName.includes("claude")) {
      if (tPlan.includes("team")) {
        if (seats < 5) {
          const newCost = 20 * seats; // Pro plan
          const savings = currentCost - newCost;
          if (savings > 0) {
            totalSavings += savings;
            recommendations.push({
              tool: tool.tool,
              action: "Downgrade to Pro",
              savings: savings,
              reason: "Claude Team requires minimum 5 seats ($150/mo). With fewer than 5 users, individual Pro licenses at $20/mo are more cost-effective."
            });
          }
        }
      }
    }

    // 3. Cursor Logic
    if (tName.includes("cursor")) {
      if (tPlan.includes("business")) {
        if (seats < 5) {
          const newCost = 20 * seats; // Pro plan
          const savings = currentCost - newCost;
          if (savings > 0) {
            totalSavings += savings;
            recommendations.push({
              tool: tool.tool,
              action: "Downgrade to Pro",
              savings: savings,
              reason: "Cursor Business ($40/mo) adds SSO and centralized billing, which is overkill for small teams. Downgrading to Pro ($20/mo) halves the cost."
            });
          }
        }
      }
    }

    // Generic fallback logic for ANY tool that hasn't been flagged yet
    const alreadyFlagged = recommendations.some(r => r.tool === tool.tool);
    if (!alreadyFlagged) {
      if (seats >= 50) {
        // High seat count - usually 10-15% of enterprise seats are unused
        const inactiveEstimate = Math.floor(seats * 0.10);
        const savings = inactiveEstimate * tool.cost;
        if (savings > 0) {
          totalSavings += savings;
          recommendations.push({
            tool: tool.tool,
            action: "Harvest Unused Licenses",
            savings: savings,
            reason: `With a large deployment of ${seats} seats, industry averages show ~10% are inactive or underutilized. Harvesting these licenses saves $${savings}/mo.`
          });
        }
      } else if (tool.cost >= 100) {
        // Very high per-user cost
        const targetCost = tool.cost * 0.8; // 20% negotiation discount
        const savings = Math.floor((tool.cost - targetCost) * seats);
        if (savings > 0) {
          totalSavings += savings;
          recommendations.push({
            tool: tool.tool,
            action: "Negotiate Enterprise Discount",
            savings: savings,
            reason: `Paying $${tool.cost}/user is a premium retail tier. Tools in this price range typically offer 20%+ discounts on annual contracts or via startup credits.`
          });
        }
      }
    }
  });

  // Second pass: Consolidation and Alternatives
  // If they have ChatGPT and Claude
  if (hasChatGPT && hasClaude) {
    const chatGPTTool = tools.find(t => t.tool.toLowerCase().includes("chatgpt") || t.tool.toLowerCase().includes("openai"));
    const claudeTool = tools.find(t => t.tool.toLowerCase().includes("claude") || t.tool.toLowerCase().includes("anthropic"));
    
    // Suggest dropping the cheaper one or just one of them.
    if (chatGPTTool && claudeTool) {
      const droppedTool = chatGPTTool.totalCost < claudeTool.totalCost ? chatGPTTool : claudeTool;
      const savings = droppedTool.totalCost;
      totalSavings += savings;
      recommendations.push({
        tool: "Multiple LLMs",
        action: `Consolidate to a single LLM (Drop ${droppedTool.tool})`,
        savings: savings,
        reason: "Paying retail for multiple frontier LLMs (ChatGPT and Claude) is redundant for most teams. Standardize on one to save costs."
      });
    }
  }

  // If they have Midjourney and ChatGPT Plus
  if (hasMidjourney && hasChatGPT) {
    const mj = tools.find(t => t.tool.toLowerCase().includes("midjourney"));
    if (mj) {
      const savings = mj.totalCost;
      totalSavings += savings;
      recommendations.push({
        tool: mj.tool,
        action: "Cancel Midjourney",
        savings: savings,
        reason: "ChatGPT Plus includes DALL-E 3 for image generation. Unless you require advanced prompt styling, you can cancel Midjourney to avoid redundant capability."
      });
    }
  }
  
  // If they have GitHub Copilot and Cursor
  if (hasCopilot && hasCursor) {
    const copilot = tools.find(t => t.tool.toLowerCase().includes("copilot"));
    if (copilot) {
      const savings = copilot.totalCost;
      totalSavings += savings;
      recommendations.push({
        tool: copilot.tool,
        action: "Cancel GitHub Copilot",
        savings: savings,
        reason: "Cursor IDE has built-in AI code completion (Copilot++) which directly replaces GitHub Copilot. Paying for both is redundant."
      });
    }
  }

  return {
    recommendations,
    totalSavings
  };
}

module.exports = { runAuditEngine };
