import {
  createEnrollment,
  checkEnrollment,
} from "../controllers/enrollment.controller.js";
import express from "express";
const router = express.Router();
router.post("/create", createEnrollment);
router.get("/check", checkEnrollment);

export default router;
