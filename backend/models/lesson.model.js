import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String },
    videoUrl: { type: String },
    attachments: { type: [String] },
    order: { type: Number, required: true },
    isPublished: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", LessonSchema);
