import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
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
const checkAccess = async (userId, lessonId) => {
  try {
    const user = await User.findById(userId).populate("purchasedLessons");
    const lesson = user.purchasedLessons.find(
      (lesson) => lesson._id.toString() === lessonId.toString()
    );

    if (!lesson) {
      throw new Error("Bạn chưa đăng ký khóa học này. Vui lòng thanh toán.");
    }
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

export { authMiddleware, checkAccess };
