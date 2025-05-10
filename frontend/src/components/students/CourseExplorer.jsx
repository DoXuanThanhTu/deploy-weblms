import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SearchBar from "./SearchBar";
import CourseList from "./CourseList";
import FilterBar from "./FilterBar";
import api from "../../utils/apiRequest";
const MainContainer = styled.div`
  padding: 50px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const CourseExplorer = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [coursesFetch, setCoursesFetch] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses/get-all");
        const fetchedCourses = response.data;
        setCoursesFetch(fetchedCourses);

        const uniqueCategories = [
          ...new Set(
            fetchedCourses.map((course) => course.category).filter(Boolean)
          ),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Lỗi khi tải khóa học:", error);
      }
    };

    fetchCourses();
  }, []);

  const sampleCourses = [
    {
      _id: "1",
      title: "JavaScript for Beginners",
      description: "A complete guide to learning JavaScript from scratch.",
      thumbnail: "https://ik.imagekit.io/tudxtwork524/LMS/5.jpg",
      rating: 4.5,
      ratingCount: 123,
      enrollmentCount: 850,
      category: "Programming",
      createdBy: "admin",
      createdAt: "2025-05-01T10:00:00Z",
    },
    {
      _id: "2",
      title: "Mastering React",
      description: "Learn to build powerful interfaces with React.",
      thumbnail: "https://ik.imagekit.io/tudxtwork524/LMS/6.jpg",
      rating: 4.7,
      ratingCount: 95,
      enrollmentCount: 1200,
      category: "Web Development",
      createdBy: "admin",
      createdAt: "2025-05-02T10:00:00Z",
    },
    {
      _id: "3",
      title: "Python for Data Science",
      description: "Harness the power of Python for data analysis and ML.",
      thumbnail: "https://ik.imagekit.io/tudxtwork524/LMS/7.jpg",
      rating: 4.6,
      ratingCount: 200,
      enrollmentCount: 2000,
      category: "Data Science",
      createdBy: "admin",
      createdAt: "2025-05-03T10:00:00Z",
    },
    {
      _id: "4",
      title: "UI/UX Design Basics",
      description: "Design beautiful and user-friendly interfaces.",
      thumbnail: "https://ik.imagekit.io/tudxtwork524/LMS/8.jpg",
      rating: 4.3,
      ratingCount: 67,
      enrollmentCount: 670,
      category: "Design",
      createdBy: "admin",
      createdAt: "2025-05-04T10:00:00Z",
    },
    {
      _id: "5",
      title: "Node.js API Development",
      description: "Build RESTful APIs with Node.js and Express.",
      thumbnail: "https://ik.imagekit.io/tudxtwork524/LMS/9.jpg",
      rating: 4.4,
      ratingCount: 82,
      enrollmentCount: 950,
      category: "Backend",
      createdBy: "admin",
      createdAt: "2025-05-05T10:00:00Z",
    },
    {
      _id: "6",
      title: "Cybersecurity Essentials",
      description: "Learn the fundamentals of staying secure online.",
      thumbnail: "https://ik.imagekit.io/tudxtwork524/LMS/10.jpg",
      rating: 4.2,
      ratingCount: 45,
      enrollmentCount: 500,
      category: "Security",
      createdBy: "admin",
      createdAt: "2025-05-06T10:00:00Z",
    },
    {
      _id: "7",
      title: "Android Development with Kotlin",
      description: "Create Android apps using modern Kotlin features.",
      thumbnail: "https://ik.imagekit.io/tudxtwork524/LMS/11.jpg",
      rating: 4.6,
      ratingCount: 140,
      enrollmentCount: 1100,
      category: "Mobile",
      createdBy: "admin",
      createdAt: "2025-05-07T10:00:00Z",
    },
    {
      _id: "8",
      title: "Introduction to AI",
      description: "Discover the basics of artificial intelligence.",
      thumbnail: "https://ik.imagekit.io/tudxtwork524/LMS/12.jpg",
      rating: 4.1,
      ratingCount: 60,
      enrollmentCount: 300,
      category: "AI",
      createdBy: "admin",
      createdAt: "2025-05-08T10:00:00Z",
    },
    {
      _id: "9",
      title: "Docker & Kubernetes",
      description: "Master containerization and orchestration tools.",
      thumbnail: "https://ik.imagekit.io/tudxtwork524/LMS/13.jpg",
      rating: 4.8,
      ratingCount: 220,
      enrollmentCount: 1750,
      category: "DevOps",
      createdBy: "admin",
      createdAt: "2025-05-09T10:00:00Z",
    },
    {
      _id: "10",
      title: "Excel for Productivity",
      description: "Automate tasks and analyze data in Excel.",
      thumbnail: "https://ik.imagekit.io/tudxtwork524/LMS/14.jpg",
      rating: 4.0,
      ratingCount: 90,
      enrollmentCount: 400,
      category: "Office Tools",
      createdBy: "admin",
      createdAt: "2025-05-10T10:00:00Z",
    },
  ];

  const filteredCourses = coursesFetch
    .filter((course) =>
      course.title.toLowerCase().includes(keyword.toLowerCase())
    )
    .filter((course) => category === "All" || course.category === category);

  return (
    <MainContainer>
      <Title>Course Explorer</Title>
      <SearchBar setKeyword={setKeyword} />
      <FilterBar setCategory={setCategory} categories={categories} />
      <CourseList courses={filteredCourses} />
    </MainContainer>
  );
};

export default CourseExplorer;
