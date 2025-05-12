import React, { useState } from "react";
import { assets } from "../../assets/assets";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../utils/authStore.js";
import axios from "axios";
import "./header.css";
const proxy = import.meta.env.VITE_API_URL;

const Container = styled.div`
  display: flex;
  align-items: center;
  height: max-content;
  padding-top: 10px;
  width: 100%;
  flex-direction: column;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  @media (min-width: 800px) {
    margin-left: 20px;
    margin-right: 20px;
    min-width: 80%;
  }
  @media (max-width: 800px) {
    width: calc(100% - 20px);
  }
`;
const Menu = styled.div`
  display: flex;
  gap: 10px;
  @media (max-width: 430px) {
    display: none;
  }
`;
const SideMenu = styled.div`
  display: none;
  @media (max-width: 430px) {
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
  }
  width: 200px;
`;
const SideMenuContainer = styled.div`
  width: 100px;
  height: 0px;
  display: ${(props) => (props.$open ? "flex" : "none")};
  height: ${(props) => props.$open && "100px"};
  position: fixed;
  right: 5px;
  top: 51px;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
  background-color: #fafafa;
`;
const Button = styled.button`
  background-color: #3738e2;
  color: white;
  padding: 5px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
`;
const Button2 = styled.button`
  width: 100%;
  border: none;
  padding: 10px;
  background-color: transparent;
  cursor: pointer;
`;
const Hr = styled.hr`
  margin-top: 10px;
  width: 100%;
  border: 0.5px solid #dfe3e6;
`;
const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [open, setOpen] = useState(false);
  const [customUser, setCustomUser] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Hàm đóng dropdown khi chọn item trong menu
  const closeDropdown = () => {
    setShowDropdown(false);
  };
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const handleCustomUser = () => {
    setCustomUser(!customUser);
  };
  const handleMyCourse = () => {
    navigate("/my-course");
  };
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${proxy}/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      navigate("/");
      removeCurrentUser();
      console.log(currentUser);
    } catch (error) {
      console.log(error);
    }
  };
  const { currentUser, removeCurrentUser } = useAuthStore();
  return (
    <Container>
      <Wrapper>
        <Link to={"/"}>
          <img src={assets.logo} alt="Logo" />
        </Link>
        {path == "/" && !currentUser && (
          <>
            <Menu>
              <Link to="/login">
                <Button>Sign in</Button>
              </Link>

              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </Menu>
            <SideMenu>
              <img
                src={open ? assets.close : assets.menu}
                alt="Menu icon"
                onClick={() => handleOpen()}
              />
              <SideMenuContainer $open={open}>
                <Link to="/login">
                  <Button2>Sign in</Button2>
                </Link>

                <Link to="/register">
                  <Button2>Register</Button2>
                </Link>
              </SideMenuContainer>
            </SideMenu>
          </>
        )}
        {!path.startsWith("/educator") && currentUser && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              cursor: "pointer",
            }}
            onClick={handleCustomUser}
          >
            {currentUser && (
              <div className="dropdown">
                <img
                  src={currentUser.img || "/icons/default-ava.png"}
                  alt="avatar"
                  className="avatar"
                  onClick={toggleDropdown}
                />
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/account" onClick={closeDropdown}>
                      Hồ sơ của tôi
                    </Link>
                    {/* Chuyển hướng đến My Course */}
                    <Link to="/my-course" onClick={closeDropdown}>
                      Khóa học của tôi
                    </Link>
                    <button onClick={handleLogout}>Đăng xuất</button>
                  </div>
                )}
              </div>
            )}
            {/* {currentUser.username}
            {customUser && <button onClick={handleLogout}>Logout</button>}
            {customUser && <button onClick={handleMyCourse}>MyCourse</button>} */}
          </div>
        )}
      </Wrapper>
      <Hr />
    </Container>
  );
};

export default Navbar;
