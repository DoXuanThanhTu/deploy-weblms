import React, { useEffect, useState } from "react";
import Navbar from "../../components/students/Navbar";
import useAuthStore from "../../utils/authStore";
import api from "../../utils/apiRequest";
import RichTextEditor from "../../components/tool/RichTextEditor";
import CoursesList from "../../components/students/CourseExplorer";
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
      <CoursesList />
    </div>
  );
};

export default Home;
