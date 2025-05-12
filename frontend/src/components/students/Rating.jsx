import React, { useState } from "react";
import styled from "styled-components";
import { Star } from "lucide-react";
import useAuthStore from "../../utils/authStore.js";
import api from "../../utils/apiRequest.js";
import { useParams } from "react-router-dom";
// Styled Components
const Container = styled.div`
  margin: 2rem auto;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const StarRow = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const StyledStar = styled(Star)`
  width: 32px;
  height: 32px;
  margin-right: 6px;
  cursor: pointer;
  color: ${(props) => (props.filled ? "#facc15" : "#d1d5db")};
  transition: color 0.2s;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #ccc;
  padding: 0.6rem;
  border-radius: 8px;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  border: 1px solid #ccc;
  padding: 0.6rem;
  border-radius: 8px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: #1e40af;
  }
  max-width: 200px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Rating = () => {
  const { id } = useParams();
  const { currentUser } = useAuthStore();
  const user = currentUser;
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [formData, setFormData] = useState({
    name: user?.username || "",
    email: user?.email || "",
    comment: "",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      courseId: id,
      rating,
      comment: formData.comment,
      name: user?.username || formData.name,
      email: user?.email || formData.email,
    };

    try {
      const res = await api.post("/reviews/create", payload);

      alert("Đánh giá của bạn đã được gửi!");
      setFormData({
        name: user?.username || "",
        email: user?.email || "",
        comment: "",
      });
      setRating(0);
    } catch (err) {
      console.error("Lỗi gửi đánh giá:", err);
      const message =
        err.response?.data?.message || err.message || "Đã có lỗi xảy ra.";
      alert(message);
    }
  };

  return (
    <Container>
      <Title>Đánh giá khóa học</Title>
      <StarRow>
        {[1, 2, 3, 4, 5].map((star) => (
          <StyledStar
            key={star}
            filled={(hovered || rating) >= star}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(star)}
            fill={(hovered || rating) >= star ? "currentColor" : "none"}
          />
        ))}
      </StarRow>

      <Form onSubmit={handleSubmit}>
        {!user && (
          <>
            <Input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </>
        )}

        <Textarea
          name="comment"
          rows="4"
          placeholder="Viết bình luận của bạn..."
          value={formData.comment}
          onChange={handleInputChange}
          required
        />

        <Button type="submit">Gửi đánh giá</Button>
      </Form>
    </Container>
  );
};

export default Rating;
