import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "educator", "student"],
      default: "student",
    },
  },
  { timestamps: true }
);
export default mongoose.model("User", UserSchema);
