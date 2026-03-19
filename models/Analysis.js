import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  jobDescription: { type: String, required: true },
  keywordsMatched: { type: [String], default: [] },
  keywordsMissing: { type: [String], default: [] },
  suggestions: { type: [String], default: [] },
  scoreBreakdown: { type: Object, default: {} },
}, { timestamps: true });

export default mongoose.model('Analysis', analysisSchema);
