import mongoose from "mongoose";

interface ICourseContent {
  subscriber: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  currentContent: mongoose.Types.ObjectId;
  watchedContent: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type { ICourseContent };
