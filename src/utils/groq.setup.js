import Groq from "groq-sdk";
import { envConfig } from "../Config/envConfig.js";

const groq = new Groq({ apiKey: envConfig.groqApiUrl });

export async function getGroqChatCompletion(resumeText) {
  return await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          'You are an ATS resume parser.\n\nTask:\nConvert the provided resume text into a clean, structured JSON object.\nRequired JSON Schema:\n{\n  "personalInfo": {\n    "name": "string",\n    "email": "string",\n    "phone": "string",\n    "location": "string",\n    "linkedin": "string",\n    "portfolio": "string"\n  },\n  "summary": "string",\n  "experience": [\n    {\n      "company": "string",\n      "position": "string",\n      "startDate": "string (YYYY-MM)",\n      "endDate": "string (YYYY-MM or \'Present\')",\n      "description": "string",\n      "achievements": ["string"]\n    }\n  ],\n  "education": [\n    {\n      "institution": "string",\n      "degree": "string",\n      "field": "string",\n      "graduationDate": "string (YYYY)",\n      "gpa": "string (optional)"\n    }\n  ],\n  "skills": {\n    "technical": ["string"],\n    "soft": ["string"],\n    "languages": ["string"],\n    "frameworks": ["string"]\n  },\n  "projects": [\n    {\n      "name": "string",\n      "description": "string",\n      "technologies": ["string"],\n      "url": "string (optional)"\n    }\n  ],\n  "certifications": [\n    {\n      "name": "string",\n      "issuer": "string",\n      "date": "string (YYYY-MM)",\n      "url": "string (optional)"\n    }\n  ]\n}\n\nRules:\n- Output ONLY valid JSON matching the schema above\n- Do not add explanations or comments\n- If data is missing, use empty strings or empty arrays\n- Do not guess or hallucinate information\n- Normalize dates to YYYY or YYYY-MM format\n- Remove duplicate skills\n- Ensure all required fields are present',
      },
      {
        role: "user",
        content: resumeText 
    },
    ],
    model: "openai/gpt-oss-120b",
    temperature: 1,
    max_completion_tokens: 8192,
    top_p: 1,
    stream: false,
    reasoning_effort: "low",
    stop: null,
  });
}