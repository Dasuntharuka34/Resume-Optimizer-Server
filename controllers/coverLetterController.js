import Resume from '../models/Resume.js';
import { generateCoverLetterWithAI } from '../services/openaiService.js';

export const generateCoverLetter = async (req, res) => {
  try {
    const { resumeId, jobDescription, tone = 'professional', applicantName = '' } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({ error: 'Missing resumeId or jobDescription' });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const coverLetter = await generateCoverLetterWithAI(
      resume.originalText,
      jobDescription,
      { tone, applicantName }
    );

    res.status(200).json({ coverLetter });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ error: error.message || 'Server error during cover letter generation' });
  }
};
