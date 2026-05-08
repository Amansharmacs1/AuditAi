export const toolPlans = {
  Cursor: ["Hobby", "Pro", "Business", "Enterprise"],
  "GitHub Copilot": ["Individual", "Business", "Enterprise"],
  Claude: [
    "Free",
    "Pro",
    "Max",
    "Team",
    "Enterprise",
    "API Direct",
  ],
  ChatGPT: ["Plus", "Team", "Enterprise", "API Direct"],
  "Anthropic API Direct": ["API Direct"],
  "OpenAI API Direct": ["API Direct"],
  Gemini: ["Pro", "Ultra", "API"],
  Windsurf: ["Standard"],
};

export const toolOptions = Object.keys(toolPlans);

export const primaryUseCaseOptions = [
  "Coding",
  "Writing",
  "Research",
  "Data Analysis",
  "Mixed",
];