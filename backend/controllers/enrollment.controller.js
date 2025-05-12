import Enrollment from "../models/enrollment.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";

import mongoose from "mongoose";

const createEnrollment = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const enrollment = new Enrollment({
      userId,
      courseId,
    });

    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (err) {
    console.error("Error creating enrollment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getCoursesByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const enrollments = await Enrollment.find({ userId });

    if (!enrollments || enrollments.length === 0) {
      return res
        .status(404)
        .json({ message: "User is not enrolled in any courses." });
    }

    const courseIds = enrollments.map((enrollment) => enrollment.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } });

    return res.json(courses);
  } catch (err) {
    console.error("Error fetching courses for user:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
const getUsersByCourseId = async (req, res) => {
  const { courseId } = req.params;

  try {
    const enrollments = await Enrollment.find({ courseId });

    if (!enrollments || enrollments.length === 0) {
      return res
        .status(404)
        .json({ message: "No users enrolled in this course." });
    }

    const userIds = enrollments.map((enrollment) => enrollment.userId);
    const users = await User.find({ _id: { $in: userIds } });

    return res.json(users);
  } catch (err) {
    console.error("Error fetching users for course:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
const checkEnrollment = async (req, res) => {
  const { userId, courseId } = req.query;

  try {
    const exists = await Enrollment.findOne({ userId, courseId });
    res.json({ enrolled: !!exists });
  } catch (err) {
    console.error("Error checking enrollment:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export {
  createEnrollment,
  getCoursesByUserId,
  getUsersByCourseId,
  checkEnrollment,
};
