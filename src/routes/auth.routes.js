import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('username').isLength({ min: 3, max: 30 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
];

const loginValidation = [
  body('email').isEmail(),
  body('password').exists()
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', auth, getMe);

export default router;