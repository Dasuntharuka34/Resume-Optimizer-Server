import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const analyzeResumeWithAI = async (resumeText, jobDescription) => {
  const prompt = `
You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
Analyze the following resume against the provided job description.

Job Description:
"""
${jobDescription}
"""

Resume:
"""
${resumeText}
"""

Provide your analysis in EXACT JSON format with the following structure:
{
  "atsScore": 85,
  "scoreBreakdown": {
    "keywordMatch": 80,
    "sectionCompleteness": 90,
    "readability": 85
  },
  "keywordsMatched": ["React", "Node.js"],
  "keywordsMissing": ["AWS", "Docker"],
  "suggestions": [
    "Quantify your achievements in bullet points (e.g., 'improved performance by 30%').",
    "Add a dedicated Skills section."
  ],
  "improvedBulletPoints": [
    {
      "original": "Worked on a website",
      "improved": "Developed and optimized a full-stack web application using the MERN stack, resulting in a 30% performance increase."
    }
  ]
}

DO NOT include any markdown formatting (like \`\`\`json) or extra text outside the JSON object. Just return the valid JSON string.
  `;

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant that evaluates resumes against job descriptions. Always respond with valid JSON only, no markdown, no extra text.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }, // forces pure JSON output
    });

    const aiText = response.choices[0].message.content.trim();
    return JSON.parse(aiText);
  } catch (error) {
    console.error('Error in Groq resume analysis:');
    console.error('  Message:', error.message);
    console.error('  Status:', error.status);
    throw new Error(`Groq error: ${error.message}`);
  }
};

export const generateCoverLetterWithAI = async (resumeText, jobDescription, options = {}) => {
  const { tone = 'professional', applicantName = '' } = options;

  const toneGuide = {
    professional: 'formal, polished, and business-appropriate',
    enthusiastic: 'warm, energetic, and passion-driven while staying professional',
    concise: 'brief, direct, and impactful — no filler phrases, maximum 3 short paragraphs',
  };

  const prompt = `
You are an expert career coach and professional writer.
Write a tailored cover letter for the following applicant based on their resume and the target job description.

${applicantName ? `Applicant Name: ${applicantName}` : 'Use "I" without a header name.'}

Tone: ${toneGuide[tone] || toneGuide.professional}

Job Description:
"""
${jobDescription}
"""

Resume:
"""
${resumeText}
"""

Instructions:
- Write a complete, ready-to-send cover letter
- Opening: Express genuine interest in the specific role with a strong hook
- Body (1-2 paragraphs): Highlight 2-3 specific achievements from the resume that are most relevant to this job. Use concrete numbers/impact where possible.
- Closing: Confident call to action
- Use natural, human language — avoid buzzword-heavy corporate speak
- Do NOT include placeholder text like [Company Name] or [Your Address] — just write the letter body
- Return ONLY the cover letter text, no commentary or explanation
  `;

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a professional cover letter writer. Write compelling, tailored cover letters. Return only the letter text — no explanations, no markdown formatting.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error in Groq cover letter generation:');
    console.error('  Message:', error.message);
    throw new Error(`Groq error: ${error.message}`);
  }
};
