import Lesson from "../models/lesson.model.js";
import Chapter from "../models/chapter.model.js";
import Course from "../models/course.model.js";

const getAllChapter = async (req, res) => {
  const user = req.user;

  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (user.role === "guest" || user.role === "student") {
      const chapters = await Chapter.find({
        courseId: req.params.courseId,
        isPublished: true,
      });
      return res.json(chapters);
    }

    if (course.createdBy.toString() === user.userId.toString()) {
      const chapters = await Chapter.find({ courseId: req.params.courseId });
      return res.json(chapters);
    }
    return res.status(403).json({ message: "Access denied" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching all chapters" });
  }
};

const createChapter = async (req, res) => {
  try {
    const newChapter = await Chapter.create(req.body);
    res.json(newChapter);
  } catch (error) {
    res.status(500).json({ message: "Error creating chapter", error: error });
  }
};

const getChapter = async (req, res) => {
  const user = req.user;
  try {
    const chapter = await Chapter.findById(req.params.id);
    const course = await Course.findById(chapter.courseId);
    if (!course || course.createdBy.toString() !== user.userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chapter" });
  }
};

const deleteChapter = async (req, res) => {
  const user = req.user;
  try {
    const chapter = await Chapter.findById(req.params.id);
    const course = await Course.findById(chapter.courseId);
    if (!course || course.createdBy.toString() !== user.userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    await Lesson.deleteMany({ chapterId: req.params.id });
    await Chapter.findByIdAndDelete(req.params.id);
    res.json("Delete Success");
  } catch (error) {
    res.status(500).json({ message: "Error deleting chapter" });
  }
};
const updateChapter = async (req, res) => {
  const user = req.user;
  try {
    const chapter = await Chapter.findById(req.params.id);
    const course = await Course.findById(chapter.courseId);

    if (!course || course.createdBy.toString() !== user.userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedChapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.json(updatedChapter);
  } catch (error) {
    res.status(500).json({ message: "Error updating chapter", error: error });
  }
};
export {
  getAllChapter,
  createChapter,
  getChapter,
  deleteChapter,
  updateChapter,
};
