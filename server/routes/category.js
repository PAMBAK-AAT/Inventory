
import express from 'express';
import { addCategory, getCategories, updateCategory, deleteCategory } from '../controllers/CategoryController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add',authMiddleware, addCategory);
router.get('/', authMiddleware, getCategories);
router.put(
  "/update/:id", 
  authMiddleware, 
  updateCategory
);

router.delete(
  "/delete/:id", 
  authMiddleware, 
  deleteCategory
);


export default router;