import mongoose from "mongoose";
import { Icontent } from "../utils/types/content";

const contentSchema =
  new mongoose.Schema<Icontent>(
    {
      contentType: {
        type: String,
        enum: ["video", "pdf"],
      },
      topic: {
        type: String,
        required: true,
      },
      content: {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model("Content", contentSchema);
