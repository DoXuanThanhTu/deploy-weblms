import Lesson from "../models/lesson.model.js";

const createLesson = async (req, res) => {
  const lesson = await Lesson.create(req.body);
  res.json(lesson);
};
const getAllLesson = async (req, res) => {
  const lessons = await Lesson.find({ chapterId: req.params.chapterId });
  res.json(lessons);
};
const getALesson = async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  res.json(lesson);
};
const updateLesson = async (req, res) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.lessonId, req.body, {
    new: "true",
  });
  res.json(lesson);
};
const deleteLesson = async (req, res) => {
  await Lesson.findByIdAndDelete(req.params.lessonId);
  res.json("Delete Success");
};
export { createLesson, getAllLesson, getALesson, updateLesson, deleteLesson };
