import React, { useEffect, useState } from "react";
import Navbar from "../../components/students/Navbar";
import useAuthStore from "../../utils/authStore";
import api from "../../utils/apiRequest";
const Home = () => {
  const { currentUser } = useAuthStore();
  const [courses, setCourses] = useState(null);
  const fetchCoursePublished = async () => {
    const res = await api.get("/courses/get-all");
    setCourses(res.data);
  };
  useEffect(() => {
    fetchCoursePublished();
  }, []);
  return (
    <div>
      Day la {currentUser?.username}
      {courses &&
        courses.map((course) => <div key={course._id}>{course.title}</div>)}
    </div>
  );
};

export default Home;
