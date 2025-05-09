import React, { useState } from "react";
import Sidebar from "../../components/educator/Sidebar";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const Content = styled.div`
  flex: 1;
  margin-left: ${({ open }) => (open ? "200px" : "40px")};
  transition: margin-left 0.3s ease;
  width: ${({ open }) => (open ? "calc(100% - 200px)" : "calc(100% - 40px)")};
`;

const EducatorMainLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar open={open} setOpen={setOpen} />
      <Content open={open}>
        <Outlet />
      </Content>
    </div>
  );
};

export default EducatorMainLayout;
