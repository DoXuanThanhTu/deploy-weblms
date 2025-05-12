import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/students/Home";
import CourseList from "./pages/students/CourseList";
import CourseDetail from "./pages/students/CourseDetail";
import MyEnrollments from "./pages/students/MyEnrollments";
import Player from "./pages/students/Player";
import Loading from "./components/students/Loading";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// Educator
import CourseDetailEducator from "./pages/educator/courseDetail/CourseDetail";
import Dashboard from "./pages/educator/dashboard/Dashboard";
import AddCourse from "./pages/educator/addCourse/AddCourse";
import MyCourse from "./pages/educator/myCourse/MyCourse";
import Lesson from "./components/educator/lesson/Lesson";
import EducatorMainLayout from "./pages/educator/EducatorMainLayout";
import Navbar from "./components/students/Navbar";
import Login from "./pages/students/Login";
import EducatorLogin from "./pages/educator/Login";
import styled from "styled-components";
import useAuthStore from "./utils/authStore";
import { Navigate } from "react-router-dom";
import { AccessDenied, NotFound } from "./pages/OtherPage";
import StudentMainLayout from "./pages/students/StudentMainLayout";
import LessonDetail from "./pages/students/LessonDetail";
const Container = styled.div`
  width: 100%;
  background-color: white;
`;

const App = () => {
  const path = useLocation().pathname;
  const isEducatorRoute = path.startsWith("/educator");
  const { currentUser } = useAuthStore();
  return (
    <>
      <Routes>
        <Route element={<StudentMainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/my-course" element={<MyEnrollments />} />

          <Route path="/login" element={<Login login={true} />} />
          <Route path="/register" element={<Login login={false} />} />
          <Route path="/course-list" element={<CourseList />} />
          <Route path="/course-list/:input" element={<CourseList />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route
            path="/course/:id/lesson/:lessonId"
            element={<LessonDetail />}
          />
          <Route path="/my-enrollment" element={<MyEnrollments />} />
          <Route path="/player/:courseId" element={<Player />} />
          <Route path="/loading/:path" element={<Loading />} />
        </Route>
        <Route
          path="/educator/*"
          element={
            currentUser?.role === "educator" ? (
              <EducatorMainLayout />
            ) : currentUser ? (
              <Navigate to="/access-denied" />
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-course" element={<MyCourse />} />
          <Route path="courses/:courseId" element={<CourseDetailEducator />} />
          <Route
            path="courses/:courseId/lessons/:lessonId"
            element={<Lesson />}
          />
        </Route>

        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/educator-login" element={<EducatorLogin />} />

        <Route path="*" element={<NotFound />} />
      </Routes>{" "}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
