import React, { useCallback, useEffect, useRef, useState } from "react";
import "./ImageDropZone.css";
import api from "../../utils/apiRequest";
import axios from "axios";
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_API_KEY;
const UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";
const PRIVATE_API_KEY = "private_T7GmjcaP4f9HJfQ3KWVWWUEAENM=";
const ImageDropZone = ({ courseId, getParent, onUploadSuccess, addCourse }) => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputFile = useRef();

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFile(file);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleClick = () => {
    if (!file) inputFile.current?.click();
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
  };
  const updateThumbnail = async (url) => {
    try {
      await api.patch(`/courses/${courseId}`, { thumbnail: url });
    } catch (error) {
    } finally {
      setUploading(false);

      location.reload();
    }
  };
  const uploadToImageKit = (file) => {
    setUploading(true);

    const upload = async () => {
      const formData = new FormData();
      const timestamp = new Date().toISOString();
      const fileName = file.name + "_" + timestamp;

      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("folder", "LMS");

      try {
        const response = await axios.post(UPLOAD_URL, formData, {
          headers: {
            Authorization: `Basic ${btoa(PRIVATE_API_KEY + ":")}`,
          },
        });

        const uploadedUrl = response.data.url;
        console.log("Uploaded URL:", uploadedUrl);

        onUploadSuccess;

        if (!getParent) {
          updateThumbnail(uploadedUrl);
        }
      } catch (error) {
        console.error(error);
      }
    };

    upload();
  };
  const [uploading, setUploading] = useState(false);

  return (
    <div
      className={`drop-image-zone ${isDragging ? "drag-hover" : ""} ${
        file ? "filed" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      {preview ? (
        <div className="preview-container">
          <button className="close-btn" onClick={handleClose}>
            <img
              src="/icons/close_white.svg"
              alt="Close"
              width="24"
              height="24"
            />
          </button>
          <img src={preview} alt="Preview" className="preview-thumbnail" />
        </div>
      ) : (
        <div className="placeholder">
          <p>Kéo ảnh vào đây hoặc bấm để chọn</p>
          <input
            type="file"
            accept="image/*"
            ref={inputFile}
            style={{ display: "none" }}
            onChange={handleChange}
          />
        </div>
      )}
      {!getParent && preview && (
        <button className="save-btn" onClick={() => uploadToImageKit(file)}>
          Save
        </button>
      )}
      <div style={{ position: "relative" }}>
        {uploading && (
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
              <p>Đang tải ảnh...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDropZone;
