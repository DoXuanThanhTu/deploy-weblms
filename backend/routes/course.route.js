import {
  getCourse,
  createCourse,
  updateCourse,
  getAllCourse,
  deleteCourse,
  getACourse,
  getMyCourse,
  getCourseInfo,
} from "../controllers/course.controller.js";
import { getUsersByCourseId } from "../controllers/enrollment.controller.js";
import { authMiddleware } from "../utils/authMiddleware.js";
import express from "express";

const router = express.Router();
router.get("/get-one/:id", authMiddleware, getACourse);
router.get("/get-one/educator/:id", authMiddleware, getCourse);
router.get("/get-all", authMiddleware, getAllCourse);
router.post("/create", authMiddleware, createCourse);
router.patch("/:id", authMiddleware, updateCourse);
router.delete("/:id", authMiddleware, deleteCourse);
router.get("/my-course/:id", authMiddleware, getMyCourse);
router.get("/get-info/:courseId", getCourseInfo);
router.get("/:courseId/users", getUsersByCourseId);

export default router;
