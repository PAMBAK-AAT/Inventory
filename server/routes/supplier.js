
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addSupplier, getSuppliers, deleteSupplier } from '../controllers/SupplierController.js';


const router = express.Router();

router.post('/add', authMiddleware, addSupplier);
router.get('/', authMiddleware, getSuppliers);
router.delete('/delete/:id', authMiddleware, deleteSupplier);

export default router;