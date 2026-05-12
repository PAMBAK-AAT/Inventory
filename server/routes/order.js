

import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { addOrder } from '../controllers/OrderController.js'

const router = express.Router()

router.post('/add', authMiddleware, addOrder)


export default router






