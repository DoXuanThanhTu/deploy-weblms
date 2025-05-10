import express from "express";
import connectDB from "./utils/connectDB.js";
import CourseRoute from "./routes/course.route.js";
import ChapterRoute from "./routes/chapter.route.js";
import LessonRoute from "./routes/lesson.route.js";
import UserRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";

import ImageKitRoute from "./routes/imagekit.route.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://route-render.web.app",
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/courses", CourseRoute);
app.use("/chapters", ChapterRoute);
app.use("/lessons", LessonRoute);
app.use("/users", UserRoute);

app.use("/imagekit", ImageKitRoute);
app.listen(8000, () => {
  connectDB();
  console.log("Server is running");
});
