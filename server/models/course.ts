import mongoose from "mongoose";
import { Icourse } from "../utils/types/course";

const courseSchema = new mongoose.Schema<Icourse>(
  {
    name: {
      type: String,
      required: true,
      set: (value: string) => value.toLowerCase(),
    },
    price: {
      type: Number,
      default: 0,
    },
    subscribers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    description: {
      type: String,
      required: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    contents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Content",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Course", courseSchema);
