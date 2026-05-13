

import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { addOrder, getOrders } from '../controllers/OrderController.js'

const router = express.Router()

router.post('/add', authMiddleware, addOrder)
router.get('/', authMiddleware, getOrders)

export default router






