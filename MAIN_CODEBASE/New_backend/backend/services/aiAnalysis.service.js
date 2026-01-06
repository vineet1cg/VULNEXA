// services/aiAnalysis.service.js
import axios from "axios";

const AI_URL = "http://192.168.56.1:5050/v1/chat/completions";
const AI_MODEL = "phi-mini"; // or your local LLM name

export async function runAIAnalysis({ code, language, findings }) {
  const systemPrompt = `
You are a secure coding assistant.

CRITICAL RULES:
- You do NOT perform vulnerability detection.
- You do NOT invent new confirmed vulnerabilities.
- The provided findings are authoritative.
- You may ONLY explain, suggest defensive fixes, and propose unverified hypotheses.
- Do NOT generate exploit payloads.
- Do NOT provide step-by-step attack instructions.
- Do NOT rewrite entire files.

OUTPUT FORMAT (STRICT):
Return JSON with the following structure:
{
  "explanation": {
    "summary": string,
    "perVulnerability": {
      "<vulnId>": string
    }
  },
  "codeSuggestions": {
    "<vulnId>": {
      "guidance": string,
      "snippet": string | null,
      "language": string
    }
  },
  "hypotheses": [
    {
      "title": string,
      "confidence": "low" | "medium",
      "reasoning": string,
      "unverified": true
    }
  ]
}
If there are no hypotheses, return an empty array.
`;

  const userPrompt = `
Language: ${language}

AUTHORITATIVE ENGINE FINDINGS:
${JSON.stringify(findings, null, 2)}

READ-ONLY CODE CONTEXT (DO NOT ANALYZE FOR NEW ISSUES):
${code}

Tasks:
1. Explain each confirmed vulnerability clearly.
2. Provide secure coding guidance per vulnerability.
3. Include short illustrative snippets ONLY if helpful.
4. Optionally suggest unverified security hypotheses.
`;

  const response = await axios.post(
    AI_URL,
    {
      model: AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 900,
    },
    { timeout: 60000 }
  );

  const raw = response.data.choices[0].message.content;

  // Safety parse: AI must return JSON
  try {
    return JSON.parse(raw);
  } catch (err) {
    // Fallback: never crash analysis
    return {
      explanation: {
        summary: "AI explanation unavailable.",
        perVulnerability: {},
      },
      codeSuggestions: {},
      hypotheses: [],
    };
  }
}
