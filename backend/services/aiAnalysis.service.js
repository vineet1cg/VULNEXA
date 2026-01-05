// services/aiAnalysis.service.js
import axios from "axios";

const AI_URL = "http://192.168.56.1:5050/v1/chat/completions";

export async function runAIAnalysis({ code, language, findings }) {
  const response = await axios.post(
    AI_URL,
    {
      model: "",
      messages: [
        {
          role: "system",
          content: `
You are a senior application security engineer. Your task is to analyze the provided code snippet for security vulnerabilities and suggest appropriate fixes. Follow these instructions:

1. Identify Vulnerabilities**: Carefully examine the code for common security issues such as:
   - SQL Injection
   - Cross-Site Scripting (XSS)
   - Cross-Site Request Forgery (CSRF)
   - Insecure Direct Object References (IDOR)
   - Security Misconfigurations
   - Insecure Cryptographic Storage
   - Insufficient Logging & Monitoring

2. Provide Detailed Analysis**: For each identified vulnerability, explain:
    The nature of the vulnerability
    Potential impact if exploited
    Conditions under which it might occur

3. Suggest Fixes: For each vulnerability identified, provide specific recommendations to mitigate the risk, including:
    Code modifications
    Best practices for secure coding
    Additional security measures (e.g., using libraries, frameworks, or tools)

4. Code Example: If applicable, include a revised version of the code that addresses the vulnerabilities.

5. Format: Structure your response as follows:
    Vulnerability 1: [Name]
      Analysis: [Detailed explanation]
      Fix: [Recommendations]
      Revised Code: [If applicable]
    Vulnerability 2: [Name]
      Analysis: [Detailed explanation]
      Fix: [Recommendations]
      Revised Code: [If applicable]

Make sure to keep the language clear and professional, and ensure that your suggestions prioritize best practices in application security.
Respond ONLY in clean Markdown format.

`,
        },
        {
          role: "user",
          content: `
Language: ${language}

Code:
${code}

Detected Issues:
${JSON.stringify(findings, null, 2)}
`,
        },
      ],
      max_tokens: 800,
    },
    { timeout: 60000 }
  );

  return response.data.choices[0].message.content;
}
