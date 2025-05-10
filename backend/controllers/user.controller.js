import User from "../models/user.model.js";
import { handleHash, verifyPassword } from "../utils/mybcrypt.js";
import jwt from "jsonwebtoken";
const createUser = async (req, res) => {
  try {
    const hashedPassword = handleHash(req.body.password, 10, 12);

    const user = await User.create({ ...req.body, password: hashedPassword });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const { password, ...others } = user.toObject();
      res.json(others);
    } else {
      res.json("User not found!");
    }
  } catch (error) {
    res.json(error);
  }
};
const registerUser = async (req, res) => {
  const { username, displayName, email, password, role } = req.body;
  if (!username || !email || !password || !displayName) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  const hashedPassword = handleHash(password, 10, 12);
  const user = await User.create({
    username,
    displayName,
    email,
    password: hashedPassword,
    role: role ? role : "student",
  });
  const token = jwt.sign(
    { userId: user._id, role: role },
    process.env.JWT_SECRET
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.status(200).json(user);
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json("User not found");
    }

    const isMatch = verifyPassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json("Wrong password");
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "None",

      maxAge: 2 * 60 * 60 * 1000,
    });
    const { password: hashedPassword, ...others } = user.toObject();
    return res.status(200).json(others);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json("Server error");
  }
};
const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update user failed:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};
const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful!" });
};
export { createUser, getUser, registerUser, loginUser, logoutUser, updateUser };
