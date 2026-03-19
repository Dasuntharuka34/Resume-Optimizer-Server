import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  originalText: { type: String, required: true },
  optimizedText: { type: String },
  atsScore: { type: Number },
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);
