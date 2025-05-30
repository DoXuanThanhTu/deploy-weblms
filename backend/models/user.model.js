import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
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
    myCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
  },
  { timestamps: true }
);
export default mongoose.model("User", UserSchema);
