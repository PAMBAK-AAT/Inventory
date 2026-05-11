
import express from "express";
import authMiddleware from '../middlewares/authMiddleware.js';

import {
  addUser,
  getUsers,
  deleteUser,
} from "../controllers/UserController.js";

const router = express.Router();

router.post("/add", authMiddleware, addUser);
router.get("/", getUsers);
router.delete("/delete/:id", authMiddleware, deleteUser);

export default router;







