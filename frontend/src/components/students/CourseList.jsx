import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import api from "../../utils/apiRequest";
const Grid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(4, 1fr);
  padding: 20px 10px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
    justify-items: center;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 360px;
  min-height: 360px;
  border: 1px solid #eee;
  border-radius: 16px;
  overflow: hidden;
  background: #faf7f7;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  @media (max-width: 600px) {
    min-width: 360px;
  }
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 160px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Info = styled.div`
  padding: 16px;
`;

const Title = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: #222;
`;

const Description = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
  line-height: 1.4;
  max-height: 3.6em;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #777;
`;

const CourseList = ({ courses, onCourseClick }) => {
  const [coursesWithInfo, setCoursesWithInfo] = useState([]);

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const coursesRes = await api.get("/courses/get-all");
        const courseList = coursesRes.data;

        const updatedCourses = await Promise.all(
          courseList.map(async (course) => {
            try {
              const [infoRes, usersRes] = await Promise.all([
                api.get(`/courses/get-info/${course._id}`),
                api.get(`/courses/${course._id}/users`),
              ]);

              return {
                ...course,
                averageRating: infoRes.data.averageRating,
                ratingCount: infoRes.data.ratingCount,
                enrollmentCount: usersRes.data.length,
              };
            } catch (err) {
              console.error(
                `Failed to fetch data for course ${course._id}`,
                err
              );
              return course;
            }
          })
        );

        setCoursesWithInfo(updatedCourses);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    fetchAllCourses();
  }, []);

  return (
    <Grid>
      {coursesWithInfo.map((course) => (
        <Link
          to={`/course/${course._id}`}
          key={course._id}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card>
            <ImageWrapper>
              {course.thumbnail ? (
                <Image src={course.thumbnail} alt={course.title} />
              ) : (
                <span style={{ color: "#aaa", fontSize: "14px" }}>
                  Không có ảnh
                </span>
              )}
            </ImageWrapper>
            <Info>
              <Title>{course.title}</Title>
              <Description>{course.description}</Description>
              <Stats>
                <span>
                  ⭐ {course.averageRating || 0} ({course.ratingCount || 0})
                </span>
                <span>👥 {course.enrollmentCount || 0} HV</span>
              </Stats>
            </Info>
          </Card>
        </Link>
      ))}
    </Grid>
  );
};

export default CourseList;
