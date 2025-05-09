import express from "express";
import {
  createUser,
  getUser,
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
const route = express.Router();
route.post("/create", createUser);
route.get("/get/:id", getUser);
route.post("/register", registerUser);
route.post("/login", loginUser);
route.post("/logout", logoutUser);
export default route;
