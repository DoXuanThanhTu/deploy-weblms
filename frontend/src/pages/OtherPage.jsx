import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 90vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #343a40;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 42px;
  margin-bottom: 10px;
`;

const Message = styled.p`
  font-size: 24px;
  margin-bottom: 30px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    background-color: #0b5ed7;
  }
`;

const Button2 = styled(Button)`
  background-color: #28a745;
  &:hover {
    background-color: #218838;
  }
`;

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Truy cập bị từ chối</Title>
      <Message>
        Bạn phải đăng nhập bằng tài khoản giáo viên để truy cập trang này.
      </Message>
      <ButtonGroup>
        <Button onClick={() => navigate("/register")}>Tạo tài khoản</Button>
        <Button2 onClick={() => navigate("/")}>Về trang chủ</Button2>
      </ButtonGroup>
    </Container>
  );
};
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>404 NOT FOUND</Title>
      <ButtonGroup>
        <Button2 onClick={() => navigate("/")}>Về trang chủ</Button2>
      </ButtonGroup>
    </Container>
  );
};
export { AccessDenied, NotFound };
