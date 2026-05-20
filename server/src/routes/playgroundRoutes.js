import express from 'express';
import { 
  getProjectPlaygrounds, 
  upsertPlaygroundSnippet, 
  analyzeSnippetWithAI 
} from '../controllers/playgroundController.js';
import { protect } from '../middleware/authMiddleware.js'; // Ensure your path matches your middleware folder structure

const router = express.Router();

// Mount secure session verification across all playground routes
router.use(protect);

router.get('/project/:projectId', getProjectPlaygrounds);
router.post('/save', upsertPlaygroundSnippet);
router.post('/:id/analyze', analyzeSnippetWithAI);

export default router;