import express from "express";
import multer from "multer";
import { getAuth, uploadFile } from "../controllers/imagekit.controller.js";

const router = express.Router();
const upload = multer();

router.get("/auth", getAuth);
router.post("/upload", upload.single("file"), uploadFile);

export default router;
