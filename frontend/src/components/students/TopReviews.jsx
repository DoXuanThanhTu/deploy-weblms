import React from "react";
import styled from "styled-components";
import { Star } from "lucide-react";

const Wrapper = styled.div`
  max-width: 600px;
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 16px;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ReviewCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Name = styled.p`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Comment = styled.p`
  margin-top: 0.5rem;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const Stars = styled.div`
  display: flex;
  margin-top: 0.25rem;
`;

const StyledStar = styled(Star)`
  width: 20px;
  height: 20px;
  margin-right: 2px;
  color: #facc15;
`;

const TopReviews = ({ reviews }) => {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <Wrapper>
        <p>Chưa có đánh giá nào.</p>
      </Wrapper>
    );
  }

  const topTwo = reviews
    .filter((r) => r.rating >= 5)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2);

  return (
    <Wrapper>
      <Title>Đánh giá nổi bật</Title>
      {topTwo.length === 0 ? (
        <p>Chưa có đánh giá 5 sao nào.</p>
      ) : (
        topTwo.map((review, index) => (
          <ReviewCard key={index}>
            <Name>{review.name}</Name>
            <Stars>
              {[...Array(review.rating)].map((_, i) => (
                <StyledStar key={i} fill="currentColor" />
              ))}
            </Stars>
            <Comment>{review.comment}</Comment>
          </ReviewCard>
        ))
      )}
    </Wrapper>
  );
};

export default TopReviews;
