const OpenAI = require('openai');

let client;
function getClient() {
  if (!client && process.env.OPENAI_API_KEY) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

async function optimizeResume(resumeText, jobDescription) {
  const openai = getClient();
  if (!openai) {
    return `[AI not configured – set OPENAI_API_KEY]\n\n${resumeText}`;
  }
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert ATS resume writer and career coach. Your job is to rewrite resumes to perfectly match job descriptions while keeping them truthful and concise. Focus on:
1. Using exact keywords from the job description
2. Quantifying achievements with metrics
3. Matching required skills sections
4. Using action verbs
5. Standard ATS-friendly formatting`,
      },
      {
        role: 'user',
        content: `RESUME:\n${resumeText.slice(0, 3000)}\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 2000)}\n\nRewrite the resume to be ATS-optimized for this specific job. Return only the resume text, no commentary.`,
      },
    ],
    max_tokens: 2000,
    temperature: 0.7,
  });
  return completion.choices[0].message.content.trim();
}

async function generateCoverLetter(resumeText, jobDescription, companyName) {
  const openai = getClient();
  if (!openai) {
    return `[AI not configured – set OPENAI_API_KEY]\n\nDear Hiring Team at ${companyName},\n\nI am writing to express my interest in this position.\n\nSincerely,\nApplicant`;
  }
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert cover letter writer. Write personalized, professional cover letters that are under 300 words. The letter should:
1. Open with a strong, specific hook
2. Connect the candidate's experience to the job requirements
3. Show enthusiasm for the company specifically
4. End with a clear call to action
Never use generic phrases. Be specific and compelling.`,
      },
      {
        role: 'user',
        content: `RESUME SUMMARY:\n${resumeText.slice(0, 2000)}\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 1500)}\n\nCOMPANY: ${companyName}\n\nWrite a personalized cover letter for this application. Keep it under 300 words.`,
      },
    ],
    max_tokens: 600,
    temperature: 0.8,
  });
  return completion.choices[0].message.content.trim();
}

module.exports = { optimizeResume, generateCoverLetter };
