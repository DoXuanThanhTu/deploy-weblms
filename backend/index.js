import express from "express";
import connectDB from "./utils/connectDB.js";
import CourseRoute from "./routes/course.route.js";
import ChapterRoute from "./routes/chapter.route.js";
import LessonRoute from "./routes/lesson.route.js";
import UserRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";
import ReviewRoutes from "./routes/review.route.js";
import EnrollmentRoutes from "./routes/enrollment.route.js";
import ImageKitRoute from "./routes/imagekit.route.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://deploy-weblms-fe.onrender.com",
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/courses", CourseRoute);
app.use("/chapters", ChapterRoute);
app.use("/lessons", LessonRoute);
app.use("/users", UserRoute);
app.use("/reviews", ReviewRoutes);
app.use("/enrollments", EnrollmentRoutes);
app.use("/imagekit", ImageKitRoute);

app.use("/api", userRoutes);
app.listen(8000, () => {
  connectDB();
  console.log("Server is running");
});
