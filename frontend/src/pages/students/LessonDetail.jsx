import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import api from "../../utils/apiRequest";
// Styled components
const LessonContainer = styled.div`
  width: 90%;
  padding: 50px;
`;
const Breadcrumbs = styled.div`
  margin-bottom: 20px;
  font-size: 1rem;
  a {
    text-decoration: none;
    color: #007bff;
  }
  span {
    margin: 0 5px;
  }
`;

const LessonTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const LessonContent = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  p {
    margin: 10px 0;
  }
  ul {
    margin-left: 20px;
  }
  pre {
    background-color: #f4f4f4;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    margin: 20px 0;
  }
  video {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
  }
`;

const LessonDetail = ({ courseId }) => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const getLesson = async () => {
      const res = await api.get(`/lessons/${lessonId}`);
      setLesson(res.data);
    };

    getLesson();
  }, [lessonId]);

  if (!lesson) {
    return <div>Loading...</div>;
  }

  return (
    <LessonContainer>
      <Breadcrumbs>
        <Link to="/">Home</Link>
        <span> &gt; </span>
        <Link to={`/course/${lesson.courseId}`}>Course</Link>
        <span> &gt; </span>
        <Link to={`/course/${lesson.courseId}/lesson/${lesson._id}`}>
          {lesson.title}
        </Link>
      </Breadcrumbs>
      <LessonTitle>{lesson.title}</LessonTitle>
      <LessonContent dangerouslySetInnerHTML={{ __html: lesson.content }} />
    </LessonContainer>
  );
};

export default LessonDetail;
