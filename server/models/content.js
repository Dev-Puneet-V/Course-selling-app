import mongoose from "mongoose";

const contentSchema = mongoose.Schema(
  {
    contentType: {
      type: String,
      enum: ["Video", "Pdf"],
    },
    topic: {
      type: String,
      required: true,
    },
    contentUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Content", contentSchema);
