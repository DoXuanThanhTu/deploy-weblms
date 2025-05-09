import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Chapter from "../../../components/educator/chapter/Chapter";
import "./CourseDetail.css";
import ImageDropZone from "../../../components/tool/ImageDropZone";
import api from "../../../utils/apiRequest";
import useAuthStore from "../../../utils/authStore.js";
import axios from "axios";
const CourseDetail = () => {
  const courseId = useParams().courseId;
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState();
  const [formData, setFormData] = useState([]);
  const [formCourse, setFormCourse] = useState([]);
  const [edit, setEdit] = useState(false);
  const [save, setSave] = useState(false);
  const [uploadFile, setUploadFile] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const { currentUser } = useAuthStore();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, chaptersRes, lessonsRes] = await Promise.all([
          api.get(`/courses/get-one/${courseId}`),
          api.get(`/chapters/get-all/${courseId}`),
        ]);
        setCourse(courseRes.data);
        setChapters(chaptersRes.data);
        setFormData(chaptersRes.data);
        setFormCourse(courseRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [courseId]);
  if (!course) return <div>Đang tải khóa học...</div>;
  const addChapter = () => {
    const newForm = [
      ...formData,
      { title: "Chapter " + (formData.length + 1), order: formData.length + 1 },
    ];
    setFormData(newForm);
    const newChapter = async () => {
      const chapter = {
        title: "Chapter " + (formData.length + 1),
        order: formData.length + 1,
        courseId: courseId,
        createdBy: currentUser._id,
      };
      setUpdating(true);
      try {
        await axios.post("http://localhost:8000/chapters/create", chapter);
        await sleep(500);
      } catch (error) {
      } finally {
        setUpdating(false);
      }
    };
    newChapter();
  };
  const handleChangeCourse = (e) => {
    const { name, value } = e.target;
    setFormCourse({ ...formCourse, [name]: value });
  };
  const handleClose = () => {
    setUploadFile(false);
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const updateCourse = async () => {
    setUpdating(true);
    try {
      await api.patch(`/courses/${courseId}`, formCourse);
    } catch (error) {
    } finally {
      await sleep(1000);
      setUpdating(false);
      location.reload();
    }
  };
  const handleRemove = async () => {
    const res = confirm("Bạn có chắc muốn xóa khóa học ? ");
    if (res) {
      setUpdating(true);
      await api.delete(`/courses/${courseId}`);
      await sleep(1000);
      setUpdating(false);

      location.pathname = "/educator/my-course";
    } else {
      return;
    }
  };
  return (
    <div className="outline">
      {uploadFile && (
        <div className="upload-thumbnail">
          <button className="close-btn2" onClick={handleClose}>
            <img
              src="/icons/close_white.svg"
              alt="Close"
              width="24"
              height="24"
            />
          </button>
          <div className="upload-thumbnail-wrapper">
            <ImageDropZone courseId={courseId} getParent={false} />
          </div>
        </div>
      )}
      <div className="container">
        <div className="left-container">
          <div className="basic">
            <h2>Basic Info</h2>
            <img
              src={!edit ? "/icons/edit.svg" : "/icons/close.svg"}
              onClick={() => {
                setEdit(!edit);
              }}
              alt="Edit"
            />
          </div>
          {edit ? (
            <div>
              <div className="item">
                <label htmlFor="">Title</label>
                <input
                  value={formCourse.title}
                  name="title"
                  onChange={handleChangeCourse}
                />
              </div>
              <div className="item">
                <label htmlFor="">Thumbnail</label>
                <img src={formCourse.thumbnail} alt={formCourse.title} />
                <div>
                  Change by
                  <button onClick={() => setUploadFile(true)}>
                    upload file
                  </button>
                </div>
              </div>

              <div className="item">
                <label htmlFor="">Description</label>
                <input
                  value={formCourse.description}
                  name="description"
                  onChange={handleChangeCourse}
                />
              </div>
              <div className="status">
                <label htmlFor="">Status</label>
                {formCourse.isPublished ? (
                  <p style={{ color: "green" }}>Publishing</p>
                ) : (
                  <p style={{ color: "gray" }}>No Publish</p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="item">
                <label htmlFor="">Title</label>
                <h2>{course.title}</h2>
              </div>
              <div className="item">
                <label htmlFor="">Thumbnail</label>
                <img src={course.thumbnail} alt={course.title} />
              </div>

              <div className="item">
                <label htmlFor="">Description</label>
                <p>{course.description}</p>
              </div>
              <div className="status">
                <label htmlFor="">Status</label>
                {formCourse.isPublished ? (
                  <p style={{ color: "green" }}>Publishing</p>
                ) : (
                  <p style={{ color: "gray" }}>No Publish</p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="right-container">
          <h2>Chapter</h2>
          {formData != null ? (
            <ul className="chapters">
              {formData.map((chapter, index) => {
                return <Chapter key={index} chapter={chapter} />;
              })}
            </ul>
          ) : (
            <>No Chapter</>
          )}
          <button className="add-new-chapter" onClick={addChapter}>
            Add new chapter
          </button>
        </div>
      </div>
      <div className="publish">
        {(edit || save) && (
          <button className="save" onClick={() => updateCourse()}>
            Save
          </button>
        )}
        {edit && (
          <>
            {formCourse.isPublished ? (
              <button
                className="no-published"
                onClick={() => {
                  setFormCourse({ ...formCourse, isPublished: false });
                }}
              >
                Stop publishing
              </button>
            ) : (
              <button
                className="published"
                onClick={() => {
                  setFormCourse({ ...formCourse, isPublished: true });
                }}
              >
                Publish
              </button>
            )}
          </>
        )}
        <button className="remove" onClick={handleRemove}>
          Remove
        </button>
      </div>
      <div style={{ position: "relative", marginRight: "40px" }}>
        {updating && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              zIndex: 9999,
              cursor: "not-allowed",
            }}
          >
            <div>
              <div
                className="spinner"
                style={{
                  width: "50px",
                  height: "50px",
                  border: "6px solid #fff",
                  borderTop: "6px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
