import express from 'express';
import { 
  getProfile,
  updateProfile,
  getUserStats 
} from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/stats', getUserStats);

export default router;