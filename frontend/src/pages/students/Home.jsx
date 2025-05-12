import React, { useEffect, useState } from "react";
import Navbar from "../../components/students/Navbar";
import useAuthStore from "../../utils/authStore";
import api from "../../utils/apiRequest";
import RichTextEditor from "../../components/tool/RichTextEditor";
import CoursesList from "../../components/students/CourseExplorer";
import "./home.css";
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
      <section className="home-section">
        <div className="home-content">
          <div className="home-text">
            <h1>Learn Programming & Design Online</h1>
            <p>
              Upgrade your skills in Web Development, UI/UX Design, and more —
              all at your own pace.
            </p>
            <button onClick={handleLoginRedirect}>Let's Start</button>
          </div>
          <div className="home-image">
            <img src={homeImage} alt="Online Learning" />
          </div>
        </div>

        <div className="course-categories">
          <h2>Course Categories</h2>
          <div className="category-list">
            <div className="category-card">
              <FaCode className="category-icon" />
              Frontend Development
            </div>
            <div className="category-card">
              <FaServer className="category-icon" />
              Backend Development
            </div>
            <div className="category-card">
              <FaPaintBrush className="category-icon" />
              UI/UX Design
            </div>
            <div className="category-card">
              <FaMobileAlt className="category-icon" />
              Mobile App
            </div>
          </div>
        </div>

        <div className="course-explorer">
          <h3>Course Explorer</h3>
        </div>
      </section>
      <CoursesList />
    </div>
  );
};

export default Home;
