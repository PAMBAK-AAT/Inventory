
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addSupplier, getSuppliers } from '../controllers/SupplierController.js';


const router = express.Router();

router.post('/add', authMiddleware, addSupplier);
router.get('/', authMiddleware, getSuppliers);

export default router;