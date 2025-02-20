import mongoose from "mongoose";

const userCourseSchema = mongoose.Schema(
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
    timestamp: true,
  }
);

export default mongoose.model("UserCourse", userCourseSchema);
