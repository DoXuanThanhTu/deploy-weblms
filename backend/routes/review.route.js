import {
  createReview,
  getTopReviews,
} from "../controllers/review.controller.js";
import express from "express";
const router = express.Router();
router.post("/create", createReview);
router.get("/top/:courseId", getTopReviews);

export default router;
