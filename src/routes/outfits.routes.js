import express from 'express';
import { 
  createOutfit, 
  getOutfits,
  getOutfit,
  updateOutfit,
  deleteOutfit,
  likeOutfit,
  getPublicOutfits,
  analyzeOutfit
} from '../controllers/outfit.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.route('/')
  .get(getOutfits)
  .post(createOutfit);

router.route('/public')
  .get(getPublicOutfits);

router.route('/:id')
  .get(getOutfit)
  .put(updateOutfit)
  .delete(deleteOutfit);

router.post('/:id/like', likeOutfit);
router.post('/:id/analyze', analyzeOutfit);

export default router;