import express from "express";
import {
  createUser,
  getUser,
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
} from "../controllers/user.controller.js";
import { getCoursesByUserId } from "../controllers/enrollment.controller.js";
const route = express.Router();
route.post("/create", createUser);
route.get("/get/:id", getUser);
route.post("/register", registerUser);
route.post("/login", loginUser);
route.post("/logout", logoutUser);
route.patch("/:id", updateUser);
route.get("/:userId/", getCoursesByUserId);

export default route;
