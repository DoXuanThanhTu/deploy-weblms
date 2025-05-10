import Chapter from "../models/chapter.model.js";
import Course from "../models/course.model.js";
import Lesson from "../models/lesson.model.js";
import User from "../models/user.model.js";
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
    return res.status(500).json(error);
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

const getACourse = async (req, res) => {
  const currentUser = req.user;
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let chapters = await Chapter.find({
      courseId: course._id,
      isPublished: true,
    });

    for (let chapter of chapters) {
      let lessons = await Lesson.find({
        chapterId: chapter._id,
        isPublished: true,
      });

      // if (currentUser.role === "guest") {
      //   lessons = lessons.filter((lesson) => lesson.isPublished);
      // } else if (currentUser.role === "student") {
      //   // If the student is enrolled in the course, they can access all lessons
      //   const isEnrolled = course.enrolledStudents.includes(currentUser._id);
      //   if (isEnrolled) {
      //     // If enrolled, show all lessons with full details
      //     lessons = lessons.filter((lesson) => lesson.isPublished);
      //   } else {
      //     // If not enrolled, show only public lessons (i.e., published lessons)
      //     lessons = lessons.filter((lesson) => lesson.isPublished);
      //   }
      // } else if (
      //   currentUser.role === "teacher" &&
      //   currentUser._id === course.createdBy
      // ) {
      //   // Teachers can access all lessons in the course
      //   lessons = lessons.filter((lesson) => lesson.isPublished);
      // } else if (currentUser.role === "admin") {
      //   // Admins can access all lessons in the course
      //   lessons = lessons.filter((lesson) => lesson.isPublished);
      // }

      // // Attach lessons to the chapter
      chapter.lessons = lessons;
      console.log(lessons);
    }

    const response = {
      course: {
        _id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        thumbnail: course.thumbnail,
        rating: course.rating,
        ratingCount: course.ratingCount,
        enrollmentCount: course.enrollmentCount,
        chapters: chapters.map((chapter) => ({
          title: chapter.title,
          description: chapter.description,
          lessons: chapter.lessons.map((lesson) => ({
            title: lesson.title,
            content: lesson.content,
            _id: lesson._id,
          })),
        })),
      },
    };

    // Step 5: Return the response as a JSON string
    return res.json(response);

    // Step 5: Return the response as a JSON string
    return res.json(response);
  } catch (error) {
    // If something goes wrong, send a 500 error
    return res.status(500).json({ message: "Error fetching course" });
  }
};
const getMyCourse = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load courses." });
  }
};
export {
  getCourse,
  getAllCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getACourse,
  getMyCourse,
};
