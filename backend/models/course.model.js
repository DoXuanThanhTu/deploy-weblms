import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    isPublished: { type: Boolean, default: false },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
