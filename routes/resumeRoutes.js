import express from 'express';
import multer from 'multer';
import { uploadResume } from '../controllers/resumeController.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('document'), uploadResume);

export default router;
