import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import { analyzeResumeWithAI } from '../services/openaiService.js';

export const analyzeResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({ error: 'Missing resumeId or jobDescription' });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Call OpenAI Service
    const aiAnalysis = await analyzeResumeWithAI(resume.originalText, jobDescription);

    // Save Analysis to DB
    const newAnalysis = new Analysis({
      resumeId,
      jobDescription,
      keywordsMatched: aiAnalysis.keywordsMatched,
      keywordsMissing: aiAnalysis.keywordsMissing,
      suggestions: aiAnalysis.suggestions,
      scoreBreakdown: aiAnalysis.scoreBreakdown,
    });
    
    await newAnalysis.save();

    resume.atsScore = aiAnalysis.atsScore;
    await resume.save();

    res.status(200).json({
      message: 'Analysis completed successfully',
      analysisId: newAnalysis._id,
      analysis: aiAnalysis
    });

  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ error: 'Server error during analysis' });
  }
};
