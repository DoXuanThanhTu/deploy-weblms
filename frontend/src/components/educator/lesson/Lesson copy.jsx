import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Lesson.css";

const proxy = import.meta.env.VITE_API_URL;

const Lesson = () => {
  const [lesson, setLesson] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { lessonId } = useParams();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios(`${proxy}/lessons/${lessonId}`);
        setLesson(response.data);
        setFormData(response.data);
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `${proxy}/lessons/${lessonId}`,
        formData
      );
      setLesson(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update lesson:", err);
    }
  };
  const addAttachment = () => {
    return <div>{console.log("add")}</div>;
  };
  if (!lesson) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="container">
      <button
        onClick={() => setIsEditing(!isEditing)}
        style={{
          position: "absolute",
          right: "20px",
          padding: "5px 12px",
          border: "none",
        }}
      >
        {isEditing ? "Cancel" : "Edit"}
      </button>
      {isEditing ? (
        <EditMode
          formData={formData}
          lesson={lesson}
          handleChange={handleChange}
          handleSave={handleSave}
          addAttachment={addAttachment}
          setFormData={setFormData}
        />
      ) : (
        <ViewMode lesson={lesson} />
      )}
    </div>
  );
};
const ViewMode = ({ lesson }) => (
  <div className="wrapper-1">
    <label className="title">Content</label>
    <div dangerouslySetInnerHTML={{ __html: lesson.content }}></div>

    <label className="title">Video</label>
    {lesson.videoUrl && (
      <div className="video">
        <iframe
          width="100%"
          height="100%"
          src={lesson.videoUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    )}

    <label className="title">Attachment URL</label>
    {lesson.attachments && lesson.attachments.length > 0 ? (
      <div>
        {lesson.attachments
          .filter((item) => item !== "")
          .map((item, index) => (
            <div key={index}>
              <a href={item} download target="_blank">
                Download Attachment {index + 1}
              </a>
            </div>
          ))}
      </div>
    ) : (
      <div>Chưa có tệp đính kèm nào</div>
    )}

    <label>Order</label>
    <p>{lesson.order}</p>

    <label>Published</label>
    <p>{lesson.isPublished ? "Yes" : "No"}</p>
  </div>
);
const EditMode = ({ formData, handleChange, handleSave, setFormData }) => {
  const removeAttachment = (indexToRemove) => {
    const newAttachments = formData.attachments.filter(
      (_, i) => i !== indexToRemove
    );
    setFormData({ ...formData, attachments: newAttachments });
  };

  return (
    <div className="wrapper">
      <label>Title</label>
      <div className="editItem">
        <input
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
        />
      </div>
      <label>Content</label>
      <div className="editItem">
        <textarea
          name="content"
          value={formData.content || ""}
          onChange={handleChange}
          rows={6}
        />
      </div>

      <label>Video</label>
      <div className="editItem">
        <input
          type="text"
          name="videoUrl"
          value={formData.videoUrl || ""}
          onChange={handleChange}
        />
      </div>

      <label>Attachment URL</label>
      <div className="attachments">
        {formData.attachments?.map((item, index) => (
          <div className="attachment-item" key={index}>
            {index + 1}.
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const updated = [...formData.attachments];
                updated[index] = e.target.value;
                setFormData({ ...formData, attachments: updated });
              }}
              style={{ width: "100%" }}
            />
            <div>
              <a
                className="attachment"
                href={item}
                target="_blank"
                rel="noreferrer"
              >
                🔗
              </a>
              <img
                src="/icons/delete.svg"
                alt="Delete"
                style={{ cursor: "pointer", marginLeft: "8px" }}
                onClick={() => removeAttachment(index)}
              />
            </div>
          </div>
        ))}
        <div
          className="add-attachment"
          onClick={() => {
            const newAttachments = [...(formData.attachments || []), ""];
            setFormData({ ...formData, attachments: newAttachments });
          }}
          style={{ cursor: "pointer", marginTop: "10px" }}
        >
          <img src="/icons/add.svg" alt="Add" />
          Add new attachment
        </div>
      </div>

      <label>Order</label>
      <input
        type="number"
        name="order"
        value={formData.order || 0}
        onChange={handleChange}
        style={{ width: "50px" }}
      />

      <label>Published</label>
      <input
        type="checkbox"
        name="isPublished"
        checked={formData.isPublished || false}
        onChange={handleChange}
      />

      <button className="save-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};
export default Lesson;
