import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useAuthStore from "../../utils/authStore";
import { useNavigate, useSearchParams } from "react-router-dom";
const proxy = import.meta.env.VITE_API_URL;
const Container = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 50px;
  width: 100%;
  font-size: 20px;
`;
const Wrapper = styled.div`
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% - 20px);
  @media (min-width: 800px) {
    margin: 0 20px;
    min-width: 90%;
  }
`;
const Main = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 90%;
  max-width: 500px;

  @media (max-width: 430px) {
    max-width: 300px;
  }
`;
const Button = styled.button`
  width: 100%;
  height: 45px;
  border: 1px solid #d4d4d4;
  border-radius: 10px;
  background-color: transparent;
  cursor: pointer;
  &:hover {
    border-color: #3738e2;
    color: #3738e2;
  }
`;
const Input = styled.input`
  width: 100%;
  font-size: 18px;
  height: 35px;
  border: 1px solid #d4d4d4;
  border-radius: 10px;
  padding-left: 10px;
  &:focus {
    outline: none;
    box-shadow: 0px 1px 10px 0px rgba(124, 134, 203, 0.75);
  }
`;
const ButtonSubmit = styled.button`
  background-color: #3738e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  height: 45px;
  cursor: pointer;
  &:hover {
    background-color: #0b40de;
  }
  margin-top: 20px;
`;
const ButtonToggle = styled.button`
  background-color: #ededfc;
  color: #3738e2;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  height: 45px;
  cursor: pointer;
  &:hover {
    background-color: #dadae2ab;
  }
`;
const Hr = styled.hr`
  margin: 10px 0;
  width: 100%;
  max-width: 500px;
  border: 0.5px solid #dfe3e6;
`;

const AuthForm = ({ fields, data, onChange, onSubmit, submitText }) => (
  <form onSubmit={onSubmit}>
    {fields.map(({ name, type, label }) => (
      <div key={name} style={{ marginTop: 10 }}>
        <label htmlFor={name}>{label}</label>
        <Input type={type} name={name} value={data[name]} onChange={onChange} />
      </div>
    ))}
    <ButtonSubmit type="submit">{submitText}</ButtonSubmit>
  </form>
);
const Login = ({ login }) => {
  const [isLogin, setIsLogin] = useState(login);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { currentUser, setCurrentUser, removeCurrentUser } = useAuthStore();
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await handleLogin();
    } else {
    }
  };
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${proxy}/users/login`,
        {
          email: data.email,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      );

      const role = res.data.role;
      if (role == "student") {
        navigate("/");
      } else if (role == "educator") {
        navigate("/educator");
      }
      setCurrentUser(res.data);
    } catch (error) {}
  };

  const loginFields = [
    { name: "email", type: "email", label: "Email" },
    { name: "password", type: "password", label: "Password" },
  ];
  const registerFields = [
    { name: "username", type: "text", label: "Username" },
    { name: "email", type: "email", label: "Email" },
    { name: "password", type: "password", label: "Password" },
  ];
  return (
    <Container>
      <Wrapper>
        <Main>
          <h1>{isLogin ? "Sign in" : "Create an account"}</h1>
          <Section>
            <Button>
              {isLogin ? "Sign in with Google" : "Sign up with Google"}
            </Button>
          </Section>
          <div
            style={{
              margin: "20px 10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Hr />
            <span
              style={{
                backgroundColor: "white",
                zIndex: 1,
                marginTop: "-28px",
              }}
            >
              or {isLogin ? "sign in with" : "create a new one here"}
            </span>
          </div>

          <Section>
            <AuthForm
              fields={isLogin ? loginFields : registerFields}
              data={data}
              onChange={handleChange}
              onSubmit={handleSubmit}
              submitText={isLogin ? "Sign in" : "Create Account"}
            />
            {isLogin && (
              <span
                style={{
                  color: "blue",
                  fontSize: "16px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                Forget password?
              </span>
            )}
          </Section>

          <Hr />

          <Section
            style={{ alignItems: "center", fontSize: "14px", color: "gray" }}
          >
            <span style={{ marginBottom: "5px" }}>
              {isLogin ? "First time here?" : "Have an account?"}
            </span>
            <ButtonToggle
              onClick={() => {
                setIsLogin(!isLogin);
                setData({
                  username: "",
                  email: "",
                  password: "",
                });
              }}
            >
              {isLogin ? "Create an Account" : "Sign in"}
            </ButtonToggle>
          </Section>
        </Main>
      </Wrapper>
    </Container>
  );
};

export default Login;
