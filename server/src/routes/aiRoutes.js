import express from 'express';
import { analyzeTaskSpecifications } from '../controllers/aiController.js';
// If your server has auth protection middleware, import it here to wrap endpoints safely

const router = express.Router();

// Triggers the automated Gemini development breakdown blueprint
router.post('/tasks/:taskId/ai-analyze', analyzeTaskSpecifications);

export default router;