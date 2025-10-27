import express from 'express';
import { body } from 'express-validator';
import { 
  createItem, 
  getItems, 
  updateItem, 
  deleteItem 
} from '../controllers/item.controller.js';
import auth from '../middleware/auth.js';
import { upload, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

router.use(auth);

// Validation rules
const itemValidation = [
  body('name').notEmpty(),
  body('category').isIn(['top', 'bottom', 'shoes', 'accessories', 'outerwear', 'dress']),
  body('color').notEmpty()
];

router.route('/')
  .get(getItems)
  .post(upload.single('image'), handleUploadError, itemValidation, createItem);

router.route('/:id')
  .put(itemValidation, updateItem)
  .delete(deleteItem);

export default router;