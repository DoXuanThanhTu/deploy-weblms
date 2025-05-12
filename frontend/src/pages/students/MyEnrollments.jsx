import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import api from "../../utils/apiRequest";
import useAuthStore from "../../utils/authStore";

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 32px;
  color: #1e3a8a;
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const Card = styled(Link)`
  display: block;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: #111827;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const CardBody = styled.div`
  padding: 16px;
`;

const CourseTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 8px;
`;

const CourseCategory = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const MyEnrollments = () => {
  const { currentUser } = useAuthStore();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get(`/users/${currentUser._id}`);
        const courseIds = res.data;
        const courseDetails = await Promise.all(
          courseIds.map((course) => api.get(`/courses/get-one/${course._id}`))
        );

        const fullCourses = courseDetails.map((res) => res.data.course);
        setCourses(fullCourses);
        console.log(fullCourses);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    fetchMyCourses();
  }, [currentUser._id]);

  return (
    <Container>
      <Title>My Enrolled Courses</Title>
      <CourseGrid>
        {courses.map((course) => (
          <Card key={course._id} to={`/course/${course._id}`}>
            <Thumbnail src={course.thumbnail} alt={course.title} />
            <CardBody>
              <CourseTitle>{course.title}</CourseTitle>
              <CourseCategory>{course.category}</CourseCategory>
            </CardBody>
          </Card>
        ))}
      </CourseGrid>
    </Container>
  );
};

export default MyEnrollments;
