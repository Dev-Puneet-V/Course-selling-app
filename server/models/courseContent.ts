import mongoose from "mongoose";
import { ICourseContent } from "../utils/types/courseContent";

const userCourseSchema = new mongoose.Schema<ICourseContent>(
  {
    subscriber: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    course: {
      ref: "Course",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    currentContent: {
      ref: "Content",
      type: mongoose.Schema.Types.ObjectId,
    },
    watchedContent: [
      {
        ref: "Content",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserCourse", userCourseSchema);
