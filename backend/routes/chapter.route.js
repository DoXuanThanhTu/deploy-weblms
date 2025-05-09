import {
  createChapter,
  getAllChapter,
  getChapter,
  deleteChapter,
} from "../controllers/chapter.controller.js";
import { authMiddleware } from "../utils/authMiddleware.js";
import express from "express";
const router = express.Router();
router.get("/:id", authMiddleware, getChapter);
router.get("/get-all/:courseId", authMiddleware, getAllChapter);
router.post("/create", createChapter);
router.delete("/:id", authMiddleware, deleteChapter);
export default router;
