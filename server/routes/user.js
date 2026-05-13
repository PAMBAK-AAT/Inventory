
import express from "express";
import authMiddleware from '../middlewares/authMiddleware.js';

import {
  addUser,
  getUsers,
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/UserController.js";

const router = express.Router();

router.post("/add", authMiddleware, addUser);
router.get("/", getUsers);
router.delete("/delete/:id", authMiddleware, deleteUser);

// Profile Routes
router.get('/profile', authMiddleware, getUser);
router.put('/update', authMiddleware, updateUser);
export default router;







