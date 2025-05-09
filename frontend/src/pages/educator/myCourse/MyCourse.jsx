import React, { useEffect, useState } from "react";
import Course from "../../../components/educator/course/Course";
import "./MyCourse.css";
import useAuthStore from "../../../utils/authStore.js";
import api from "../../../utils/apiRequest.js";
const MyCourse = () => {
  const { currentUser } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const getAllCourse = async () => {
    const res = await api.get("/courses/get-all");
    setCourses(res.data);
  };
  useEffect(() => {
    getAllCourse();
  }, []);
  return (
    <div className="myCourse">
      <div className="myCourseContainer">
        {courses.map((course) => (
          <Course key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default MyCourse;
