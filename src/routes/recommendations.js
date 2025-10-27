import express from 'express';
import { 
  getDailyRecommendation,
  getSimilarItems,
  getCompleteOutfit 
} from '../controllers/recommendation.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/daily', getDailyRecommendation);
router.get('/similar/:itemId', getSimilarItems);
router.get('/complete-outfit', getCompleteOutfit);

export default router;