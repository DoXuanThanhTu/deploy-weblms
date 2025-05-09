import React, { useEffect, useState } from "react";
import "./Course.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Chapter from "../chapter/Chapter";

const Course = ({ course }) => {
  return (
    <div className="course-container">
      <Link
        to={`/educator/courses/${course._id}`}
        key={course._id}
        className="course-link"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div>
          <div className="img-container">
            <img
              className="course-image"
              src={course.thumbnail}
              alt={course.title}
            />
          </div>
          <div className="course-info">
            <div className="course-title">{course.title}</div>
            {course.isPublished ? (
              <p
                style={{
                  fontSize: "18px",
                  color: "white",
                  backgroundColor: "green",
                  padding: "8px",
                  borderRadius: "5px",
                  width: "fit-content",
                }}
              >
                Published
              </p>
            ) : (
              <p
                style={{
                  fontSize: "18px",
                  color: "white",
                  backgroundColor: "gray",
                  padding: "8px",
                  borderRadius: "5px",
                  width: "fit-content",
                }}
              >
                Not Published
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
export default Course;
