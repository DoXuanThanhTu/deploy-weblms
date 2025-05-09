import jwt from "jsonwebtoken";
import Lesson from "../models/lesson.model.js";
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      }

      req.user = decoded;
      next();
    });
  } else {
    req.user = { role: "guest" };
    next();
  }
};
const checkLessonOwner = async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });

  if (lesson.ownerId.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  next();
};
export { authMiddleware, checkLessonOwner };
