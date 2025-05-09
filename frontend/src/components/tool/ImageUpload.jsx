import React, { useCallback, useRef, useState } from "react";

const ImageUpload = ({ setFileSelected }) => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputFile = useRef();

  const handleFile = async (file) => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFile(file);
      setFileSelected(file);
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

  const handleClose = (e) => {
    e.preventDefault();
    setFile(null);
    setPreview(null);
  };
  return (
    <div
      className={`drop-image-zone ${isDragging ? "drag-hover" : ""} ${
        file ? "filed" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
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
    </div>
  );
};
export default ImageUpload;
