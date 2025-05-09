import React, { useEffect, useState } from "react";
import "./AddCourse.css";
import ImageUpload from "../../../components/tool/ImageUpload";
import Uploading from "../../../components/tool/Uploading";
import axios from "axios";

const proxy = import.meta.env.VITE_API_URL;
const publicKey = "public_SsuFxqpe+LsB5KB1RcRwSUDs5nk=";

const AddCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setUploading(true);
  };

  const handleUploadSuccess = (selectedFile) => {
    setFile(selectedFile);
  };

  useEffect(() => {
    if (uploading) {
      handleUpload();
    }
  }, [uploading]);

  const handleUpload = async () => {
    try {
      const authRes = await axios.get(`${proxy}/imagekit/auth`);
      const { signature, expire, token } = authRes.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", publicKey);
      formData.append("signature", signature);
      formData.append("expire", expire);
      formData.append("token", token);

      const res = await axios.post(`${proxy}/imagekit/upload`, formData);
      setImageUrl(res.data.url);

      const course = {
        title,
        description,
        thumbnail: res.data.url,
      };

      const courseRes = await axios.post(`${proxy}/courses/create`, course);

      if (courseRes?.data?._id) {
        window.location.pathname = `/educator/courses/${courseRes.data._id}`;
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Đã xảy ra lỗi khi tạo khóa học.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="addCourse">
      <h2>Tạo khóa học mới</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </label>

        <label>
          Thumbnail:
          <ImageUpload setFileSelected={handleUploadSuccess} />
        </label>

        <button type="submit">Tạo khóa học</button>
      </form>

      {uploading && <Uploading text="Đang tạo khóa học..." />}
    </div>
  );
};

export default AddCourse;
