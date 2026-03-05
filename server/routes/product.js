

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addProduct, getProducts, updateProduct, deleteProduct } from '../controllers/ProductController.js';

const router = express.Router();

router.get('/', authMiddleware, getProducts);
router.post('/add', authMiddleware, addProduct);
router.put('/edit/:id', authMiddleware, updateProduct);
router.delete('/delete/:id', authMiddleware, deleteProduct);

export default router;



