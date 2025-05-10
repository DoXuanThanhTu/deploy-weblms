import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import styled from "styled-components";
import api from "../../utils/apiRequest";
import { useParams } from "react-router-dom";
import Notification from "./Notification";
import CusNotification from "./Notification";
const publicKey = "public_SsuFxqpe+LsB5KB1RcRwSUDs5nk=";

// Styled Button
const SaveButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  float: right;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const RichTextEditor = ({ initialContent }) => {
  const { lessonId } = useParams();
  const editorRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleEditorChange = (content, editor) => {};

  const handleSave = async () => {
    if (!editorRef.current) return;
    setSaving(true);

    const rawHtml = editorRef.current.getContent();
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");
    const images = Array.from(doc.querySelectorAll("img"));

    const authRes = await api.get("/imagekit/auth");
    const { signature, expire, token } = authRes.data;

    for (let img of images) {
      if (img.src.startsWith("data:image")) {
        const blob = await (await fetch(img.src)).blob();
        const timestamp = Date.now();
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("fileName", `lesson-${lessonId}-${timestamp}.png`);
        formData.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
        formData.append("signature", signature);
        formData.append("expire", expire);
        formData.append("token", token);

        const res = await api.post(`/imagekit/upload`, formData);

        const data = res.data;

        img.src = data.url;
      }
    }

    const finalContent = doc.body.innerHTML;
    setSaving(false);
    try {
      const response = await api.patch(`/lessons/${lessonId}`, {
        content: finalContent,
      });
    } catch (err) {
      console.error("Failed to update lesson:", err);
    }
    setNotification({
      message: "Changes saved successfully!",
      type: "success",
    });
  };
  const closeNotification = () => {
    setNotification(null);
    window.location.reload();
  };
  return (
    <div>
      {notification && (
        <CusNotification
          message={notification.message}
          duration={2000}
          onClose={() => setNotification(null)}
        />
      )}
      <Editor
        apiKey="qdng0qk6fb6jkg0vgtvqx7y4awk4wkdft2xfr0jn70igcjqo"
        initialValue={initialContent}
        onInit={(evt, editor) => (editorRef.current = editor)}
        onEditorChange={handleEditorChange}
        init={{
          height: 400,
          menubar: true,
          plugins: "link image media table code lists fullscreen",
          toolbar:
            "undo redo | formatselect | bold italic | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | link image media table | code fullscreen",
          automatic_uploads: false,
          file_picker_types: "image",
          file_picker_callback: function (callback, value, meta) {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.onchange = function () {
                const file = this.files[0];
                const reader = new FileReader();
                reader.onload = function () {
                  callback(reader.result, { title: file.name });
                };
                reader.readAsDataURL(file);
              };
              input.click();
            }
          },
        }}
      />

      <SaveButton onClick={handleSave} disabled={saving}>
        {saving ? "Đang lưu..." : "💾 Save Changes"}
      </SaveButton>
    </div>
  );
};

export default RichTextEditor;
