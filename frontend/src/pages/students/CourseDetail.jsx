import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import api from "../../utils/apiRequest";
import RatingForm from "../../components/students/Rating";
import Rating from "../../components/students/Rating";
import TopReviews from "../../components/students/TopReviews";
import useAuthStore from "../../utils/authStore";
const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  background: #1e40af;
  color: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
`;

const TitleSection = styled.div`
  max-width: 600px;
`;

const Title = styled.h1`
  font-size: 28px;
  margin: 0;
`;

const SubTitle = styled.h2`
  font-size: 18px;
  font-weight: 400;
`;
const EnrollBox = styled.div`
  margin-top: 16px;
  background: ${(props) => (props.enrolled ? "#d1fae5" : "#e0f2fe")};
  color: ${(props) => (props.enrolled ? "#065f46" : "#1e3a8a")};
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  display: inline-block;
  font-size: 16px;
  border: 1px solid ${(props) => (props.enrolled ? "#34d399" : "#60a5fa")};

  button {
    background-color: #2563eb;
    color: white;
    border: none;
    padding: 8px 16px;
    font-size: 15px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s ease;

    &:hover {
      background-color: #1d4ed8;
    }
  }
`;

const Image = styled.img`
  max-width: 400px;
  height: auto;
  border-radius: 12px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  font-size: 15px;
`;

const Section = styled.section`
  margin-top: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 12px;
  color: #111827;
`;

const Paragraph = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #333;
`;
const ChapterList = styled.div`
  margin-top: 20px;
`;

const ChapterTitle = styled.h4`
  font-size: 18px;
  margin: 10px 0;
  color: #1e40af;
`;

const LessonList = styled.ul`
  margin-left: 20px;
  list-style-type: none;
  padding: 0;
`;

const LessonItem = styled.li`
  margin: 8px 0;
  font-size: 16px;
`;

const LessonLink = styled.a`
  color: #1e40af;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
const CourseContent = styled.ul`
  width: 60%;
  margin-top: 20px;
  margin-left: 20px;
  min-width: 400px;
  list-style: none;
`;

const CourseItem = styled.li`
  min-height: 50px;
  width: 100%;
  background-color: #f6f7f9;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border: 0.5px solid #d1d2e0;
`;

const Content = styled.button`
  width: 90%;
  height: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  border: none;
  font-weight: bold;
  cursor: pointer;
  background-color: #f6f7f9;
  font-size: 20px;
`;

const ArrowButton = styled.button`
  width: 24px;
  aspect-ratio: 1/1;
  cursor: pointer;
  transform: rotate(${(props) => (props.$dropStatus ? "180deg" : "0deg")});
  transition: transform 0.2s ease-in-out;
  border: none;
  background-color: transparent;
`;

const ArrowDrop = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SubContent = styled.ul`
  visibility: ${(props) => (props.$dropStatus ? "visible" : "hidden")};
  height: ${(props) => (props.$dropStatus ? "" : "0px")};
  list-style: none;
  border: ${(props) => (props.$dropStatus ? "0.5px solid #d1d2e0" : "none")};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SubContentItem = styled.li`
  height: 50px;
  font-size: 16px;
  width: 100%;
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  padding-left: 30px;
  &:nth-child(even) {
    background-color: #efefef;
  }

  &:nth-child(odd) {
    background-color: #ffffff;
  }
  border: none;
  outline: none;
`;

const Head = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
  justify-content: space-around;
`;

const CourseLayout = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  flex: 1;
  min-width: 250px;
`;
const CourseDetail = () => {
  const { currentUser } = useAuthStore();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [openChapters, setOpenChapters] = useState([]);
  const [review, setReview] = useState([]);
  const [info, setInfo] = useState([]);
  const [en, setEn] = useState(0);
  const dropDown = (index) => {
    if (openChapters.includes(index)) {
      setOpenChapters(openChapters.filter((i) => i !== index));
    } else {
      setOpenChapters([...openChapters, index]);
    }
  };
  const fetchTopReviews = async (courseId) => {
    const res = await api.get(`/reviews/top/${courseId}`);
    const data = await res.data;
    return data;
  };
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/courses/get-one/${id}`);
        setCourse(res.data.course);

        const info = await api.get(`/courses/get-info/${id}`);
        setInfo(info.data);
        const re = await api.get(`/courses/${id}/users`);
        if (re.data) {
          setEn(re.data.length);
        }
        const topReviews = await fetchTopReviews(id);
        setReview(topReviews);

        const user = currentUser;
        if (user?._id) {
          const check = await api.get(`/enrollments/check`, {
            params: { userId: user._id, courseId: id },
          });
          setIsEnrolled(check.data.enrolled);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, [id]);

  if (!course) return <p>Loading course...</p>;
  return (
    <Container>
      <Header>
        <TitleSection>
          <Title>{course.title}</Title>
          <SubTitle>{course.category}</SubTitle>
          <EnrollBox enrolled={isEnrolled}>
            {isEnrolled ? (
              "Đã đăng ký"
            ) : (
              <button
                onClick={async () => {
                  try {
                    if (!currentUser) return alert("Bạn cần đăng nhập trước");
                    await api.post("/enrollments/create", {
                      userId: currentUser._id,
                      courseId: id,
                    });

                    setIsEnrolled(true);
                  } catch (err) {
                    console.error("Enrollment failed:", err);
                    alert("Đăng ký thất bại");
                  }
                }}
              >
                Đăng ký học
              </button>
            )}
          </EnrollBox>
        </TitleSection>
        <Image src={course.thumbnail} alt={course.title} />
      </Header>

      <Row>
        <div>
          <strong>⭐ Rating:</strong> {info.averageRating} ({info.ratingCount}
          votes)
        </div>
        <div>
          <strong>👥 Enrolled:</strong> {en} students
        </div>
      </Row>

      <Section>
        <SectionTitle>Mô tả khóa học</SectionTitle>
        <Paragraph>{course.description}</Paragraph>
      </Section>
      <Section>
        <SectionTitle>Chapters and Lessons</SectionTitle>
        {/* <ChapterList>
          {course.chapters.map((chapter, index) => (
            <div key={index}>
              <ChapterTitle>{chapter.title}</ChapterTitle>
              <LessonList>
                {chapter.lessons.map((lesson, lessonIndex) => (
                  <LessonItem key={lessonIndex}>
                    <span>{lesson.title}</span>
                    <LessonLink href={`/course/${id}/lesson/${lesson._id}`}>
                      - Go to Lesson
                    </LessonLink>
                  </LessonItem>
                ))}
              </LessonList>
            </div>
          ))}
        </ChapterList> */}
        <CourseLayout>
          <CourseContent>
            {course.chapters.map((chapter, chapterIndex) => (
              <CourseItem key={chapterIndex}>
                <Head>
                  <ArrowButton
                    $dropStatus={openChapters.includes(chapterIndex)}
                    onClick={() => dropDown(chapterIndex)}
                  >
                    <ArrowDrop src="/icons/arrow_drop.png" />
                  </ArrowButton>
                  <Content>{chapter.title}</Content>
                </Head>
                <SubContent $dropStatus={openChapters.includes(chapterIndex)}>
                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <SubContentItem key={lessonIndex}>
                      <Link
                        to={`lesson/${lesson._id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {lesson.title}
                      </Link>
                    </SubContentItem>
                  ))}
                </SubContent>
              </CourseItem>
            ))}
          </CourseContent>

          <Sidebar>
            <TopReviews reviews={review} />
          </Sidebar>
        </CourseLayout>
      </Section>
      <Rating />
    </Container>
  );
};

export default CourseDetail;
