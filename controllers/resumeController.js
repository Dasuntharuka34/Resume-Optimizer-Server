import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';
import Resume from '../models/Resume.js';

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { mimetype, buffer, originalname } = req.file;
    let extractedText = '';

    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      originalname.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file format. Please upload PDF or DOCX.' });
    }

    const newResume = new Resume({
      originalText: extractedText
    });

    await newResume.save();

    res.status(200).json({
      message: 'File processed successfully',
      resumeId: newResume._id,
      extractedText
    });
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ error: error.message || 'Server error during file processing', stack: error.stack });
  }
};

