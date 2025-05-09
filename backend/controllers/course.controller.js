import Chapter from "../models/chapter.model.js";
import Course from "../models/course.model.js";
import Lesson from "../models/lesson.model.js";

const getAllCourse = async (req, res) => {
  const currentUser = req.user;
  try {
    if (currentUser.role === "student" || currentUser.role === "guest") {
      const courses = await Course.find({ isPublished: true });
      return res.json(courses);
    }

    const courses = await Course.find({ createdBy: currentUser.userId });
    return res.json(courses);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching courses" });
  }
};

const getCourse = async (req, res) => {
  const currentUser = req.user;
  try {
    if (currentUser.role === "student" || currentUser.role === "guest") {
      const courses = await Course.find({ isPublished: true });
      return res.json(courses);
    }

    const courses = await Course.findById(req.params.id);
    return res.json(courses);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching courses" });
  }
};

const createCourse = async (req, res) => {
  const reqData = req.body;
  try {
    const newCourse = await Course.create(reqData);
    return res.json(newCourse);
  } catch (error) {
    return res.status(500).json({ message: "Error creating course" });
  }
};

const updateCourse = async (req, res) => {
  const currentUser = req.user;
  try {
    const course = await Course.findById(req.params.id);
    if (course.createdBy.toString() !== currentUser.userId.toString()) {
      return res
        .status(403)
        .json({ message: "You do not have permission to update this course" });
    }
    const updatedCourse = await Course.updateOne(
      { _id: req.params.id },
      req.body
    );
    return res.json(updatedCourse);
  } catch (error) {
    return res.status(500).json({ message: "Error updating course" });
  }
};

const deleteCourse = async (req, res) => {
  const currentUser = req.user;
  try {
    const course = await Course.findById(req.params.id);
    if (course.createdBy.toString() !== currentUser.userId.toString()) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this course" });
    }
    const chapters = await Chapter.find({ courseId: req.params.id });
    const chapterIds = chapters.map((item) => item._id);
    await Lesson.deleteMany({ chapterId: { $in: chapterIds } });
    await Chapter.deleteMany({ courseId: req.params.id });
    const deleteResult = await Course.deleteOne({ _id: req.params.id });
    return res.json("Delete successful!");
  } catch (error) {
    return res.status(500).json({ message: "Error deleting course" });
  }
};

export { getCourse, getAllCourse, createCourse, updateCourse, deleteCourse };
