import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import useAuthStore from "../../utils/authStore";
const proxy = import.meta.env.VITE_API_URL;
const SidebarContainer = styled.div`
  width: 200px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #2c3e50;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100vh;
  z-index: 1000;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
  transition: transform 0.3s ease;
  padding-top: 50px;
`;

const SidebarItem = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 16px;
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background-color: #34495e;
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1101;
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #34495e;
  }
`;
const SidebarLogout = styled.div`
  color: white;
  text-decoration: none;
  font-size: 16px;
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background-color: #34495e;
  }
`;
const Sidebar = ({ open, setOpen }) => {
  const { removeCurrentUser, currentUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await axios.post(`${proxy}/users/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.log(error);
    } finally {
      removeCurrentUser();
    }
  };

  return (
    <>
      <ToggleButton onClick={() => setOpen(!open)}>
        {open ? "✖" : "☰"}
      </ToggleButton>
      <SidebarContainer open={open}>
        <SidebarItem to="/educator/dashboard">📚 Dashboard</SidebarItem>
        <SidebarItem to="/educator/my-course">📚 My Courses</SidebarItem>
        <SidebarItem to="/educator/add-course">➕ Add New Course</SidebarItem>
        <SidebarLogout onClick={handleLogout}>
          Logout {currentUser?.username}
        </SidebarLogout>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
