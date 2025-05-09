import React from "react";
import Navbar from "../../components/students/Navbar";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

const StudentMainLayout = () => {
  return (
    <Container>
      <Navbar />
      <Outlet />
    </Container>
  );
};

export default StudentMainLayout;
