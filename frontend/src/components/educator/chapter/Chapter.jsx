import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Chapter.css";
import { Link } from "react-router-dom";
import api from "../../../utils/apiRequest.js";
import useAuthStore from "../../../utils/authStore.js";
const proxy = import.meta.env.VITE_API_URL;

const Chapter = ({ chapter }) => {
  const [lessons, setLessons] = useState([]);
  const [lessonId, setLessonId] = useState([]);
  const [editChapter, setEditChapter] = useState("close");
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [formDataBeforeEdit, setFormDataBeforeEdit] = useState([]);

  const { currentUser } = useAuthStore();
  const fetchLessons = async () => {
    try {
      const res = await api.get(`/lessons/get-all/${chapter._id}`);
      setLessons(res.data);
      setFormData(res.data);
    } catch (error) {}
  };
  useEffect(() => {
    chapter._id && fetchLessons();
  }, [chapter]);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const handleSelectLesson = (id) => {
    if (!lessonId.includes(id)) {
      setLessonId([...lessonId, id]);
    } else {
      const newLessonIds = lessonId.filter((item) => item !== id);
      setLessonId(newLessonIds);
    }
  };
  const switchEditMode = (mode) => {
    console.log("chuaedit", formData);
    setFormDataBeforeEdit(JSON.parse(JSON.stringify(formData)));
    setEditChapter(mode);
  };
  const handleAdd = () => {
    const newLesson = {
      _id: "Form" + chapter._id + (formData.length + 1),
      title: "Lesson " + (formData.length + 1),
      order: formData.length + 1,
      chapterId: chapter._id,
    };
    setFormData([...formData, newLesson]);
  };
  const handleSaveDelete = async () => {
    const confirmDelete = confirm(
      `Bạn có chắc muốn xóa ${lessonId.length} bài học?`
    );
    if (!confirmDelete) return;
    setUpdating(true);

    try {
      const isServerId = (id) => !id.startsWith("Form");
      const realIds = lessonId.filter(isServerId);
      await Promise.all(realIds.map((id) => api.delete(`/lessons/${id}`)));

      const updatedLessons = formData
        .filter((lesson) => {
          const isToDelete = lessonId.includes(lesson._id);
          return !isToDelete;
        })
        .map((lesson, i) => ({ ...lesson, order: i + 1 }));

      setFormData(updatedLessons);
      setLessonId([]);
    } catch (error) {
      console.error("Lỗi khi xóa bài học:", error);
    } finally {
      setUpdating(false);
      setEditChapter("edit");
    }
  };
  const handleCancel = () => {
    setFormData([...formDataBeforeEdit]);
    setEditChapter("edit");
    setLessonId([]);
  };
  const handleSaveAdd = async () => {
    setUpdating(true);
    const isNew = (lesson) => lesson._id.startsWith("Form");
    const newLessons = formData.filter(isNew);
    try {
      for (const lesson of newLessons) {
        await api.post(`/lessons/create`, {
          title: lesson.title,
          order: lesson.order,
          chapterId: lesson.chapterId,
          createdBy: currentUser._id,
        });
      }
      fetchLessons();
    } catch (err) {
    } finally {
      setUpdating(false);
    }

    setEditChapter("edit");
  };
  const handleDragStart = (index) => {
    if (!editChapter === "order") {
      return;
    }
    setDragIndex(index);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!editChapter === "order") {
      return;
    }
  };
  const handleDrop = (index) => {
    if (!editChapter === "order") {
      return;
    }
    const newForm = [...formData];
    const lesson = newForm[dragIndex];
    newForm.splice(dragIndex, 1);
    newForm.splice(index, 0, lesson);
    newForm.map((item, index) => {
      item.order = index + 1;
    });
    setFormData(newForm);
    setDragIndex(null);
  };
  const getChangedLessons = (original, updated) => {
    return updated.filter((lesson, index) => {
      return lesson._id !== original[index]._id;
    });
  };

  const handleSaveOrder = async () => {
    const changed = getChangedLessons(lessons, formData);
    setUpdating(true);
    if (changed.length > 0) {
      console.log(changed);

      try {
        for (const lesson of changed) {
          await api.patch(`lessons/${lesson._id}`, {
            order: lesson.order,
          });
        }
      } catch (error) {
      } finally {
        setUpdating(false);
      }
    }
    setEditChapter("edit");
  };
  return (
    <li className="chapter">
      <div className="chapter-header">
        <span>{chapter.title}</span>
        <div className="tool">
          {editChapter === "close" ? (
            <img
              src="/icons/edit.svg"
              onClick={() => {
                setEditChapter("edit");
                setOpen(true);
              }}
              alt="Edit"
            />
          ) : (
            <img
              src="/icons/close.svg"
              onClick={() => {
                setEditChapter("close");
              }}
              alt="Close"
            />
          )}
          <img src="/icons/delete.svg" alt="Delete" />
          <img
            src="/icons/arrow_drop.svg"
            className={`icon ${open ? "rotate" : ""}`}
            alt="expand"
            onClick={toggleOpen}
          />
        </div>
      </div>
      {editChapter === "edit" && (
        <div className="mode">
          <button onClick={() => switchEditMode("add")}>➕ Add Lesson</button>
          <button onClick={() => switchEditMode("delete")}>
            ❌ Delete Lesson
          </button>
          <button onClick={() => switchEditMode("order")}>
            🔃 Change Order
          </button>
        </div>
      )}
      {editChapter === "add" && (
        <div className="mode">
          <button onClick={handleAdd}>➕ Add New Lesson</button>
          <button onClick={handleSaveAdd}>💾 Save</button>
          <button onClick={handleCancel}>❎ Cancel</button>
        </div>
      )}

      {editChapter === "delete" && (
        <div className="mode">
          <button onClick={handleSaveDelete}>💾 Save</button>
          <button onClick={handleCancel}>❎ Cancel</button>
        </div>
      )}

      {editChapter === "order" && (
        <div className="mode">
          <button onClick={handleSaveOrder}>💾 Save</button>
          <button onClick={handleCancel}>❎ Cancel</button>
        </div>
      )}
      {open && (
        <div>
          <ul className="lessons">
            {formData
              ?.sort((a, b) => a.order - b.order)
              .map((lesson, index) => (
                <li
                  className={`lesson ${editChapter === "order" && "hover"}`}
                  key={lesson._id}
                  draggable={editChapter === "order"}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                >
                  <div className="lessonItem">
                    {editChapter === "delete" && (
                      <input
                        type="checkbox"
                        checked={lessonId.includes(lesson._id)}
                        onChange={() => handleSelectLesson(lesson._id)}
                      />
                    )}
                    <div className="ellipsis">{lesson.title}</div>
                  </div>
                  {!lesson._id.startsWith("Form") && (
                    <div>
                      <Link to={`lessons/${lesson._id}`}>
                        <img src="/icons/info.svg" alt="Info" />
                      </Link>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
      <div style={{ position: "relative", marginRight: "40px" }}>
        {updating && <LoadingOverlay />}
      </div>
    </li>
  );
};
const LoadingOverlay = () => {
  return (
    <>
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
    </>
  );
};
export default Chapter;
