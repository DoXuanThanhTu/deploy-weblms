import {
  getCourse,
  createCourse,
  updateCourse,
  getAllCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { authMiddleware } from "../utils/authMiddleware.js";
import express from "express";

const router = express.Router();
router.get("/get-one/:id", authMiddleware, getCourse);
router.get("/get-all", authMiddleware, getAllCourse);
router.post("/create", authMiddleware, createCourse);
router.patch("/:id", authMiddleware, updateCourse);
router.delete("/:id", authMiddleware, deleteCourse);
export default router;
