import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Lesson.css";
import RichTextEditor from "../../tool/RichTextEditor";
import styled from "styled-components";

const EditButton = styled.button`
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;
const CancelButton = styled.button`
  background-color: #ef4444;
  color: white;
  font-weight: 600;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
  &:hover {
    background-color: #dc2626;
  }
`;
const proxy = import.meta.env.VITE_API_URL;

const Lesson = () => {
  const [lesson, setLesson] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { lessonId } = useParams();
  const fetchLesson = async () => {
    try {
      const response = await axios(`${proxy}/lessons/${lessonId}`);
      setLesson(response.data);
      setFormData(response.data);
    } catch (err) {
      console.error("Failed to fetch lesson:", err);
    }
  };
  useEffect(() => {
    fetchLesson();
  }, [lessonId]);
  const handleCancel = () => {
    setIsEditing(false);
    fetchLesson();
  };
  return (
    <div>
      {lesson && (
        <div>
          <h1>{lesson.title}</h1>
          {isEditing ? (
            <>
              <RichTextEditor initialContent={lesson.content || ""} />
              <CancelButton onClick={() => handleCancel()}>Cancel</CancelButton>
            </>
          ) : (
            <>
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              <EditButton onClick={() => setIsEditing(true)}>Edit</EditButton>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Lesson;
