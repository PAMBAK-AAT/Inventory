

import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { addOrder, getOrders, deleteOrder } from '../controllers/OrderController.js'

const router = express.Router()

router.post('/add', authMiddleware, addOrder)
router.get('/', authMiddleware, getOrders)
router.delete('/delete/:id', authMiddleware, deleteOrder)

export default router






