import {
  createLesson,
  getAllLesson,
  getALesson,
  updateLesson,
  deleteLesson,
} from "../controllers/lesson.controller.js";
import express from "express";
const router = express.Router();
router.post("/create", createLesson);
router.get("/get-all/:chapterId", getAllLesson);
router.get("/:lessonId", getALesson);
router.patch("/:lessonId", updateLesson);
router.delete("/:lessonId", deleteLesson);

export default router;
