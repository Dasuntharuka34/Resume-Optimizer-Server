import express from 'express';
import { generateCoverLetter } from '../controllers/coverLetterController.js';

const router = express.Router();

router.post('/generate', generateCoverLetter);

export default router;
