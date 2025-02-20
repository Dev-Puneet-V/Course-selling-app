import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const variables = {
  PORT: process.env.PORT || 3000,
  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET || "",
  JWT_EXPIRY: process.env.JWT_EXPIRY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected successfully");
  } catch (error) {
    throw new Error("Error connection error");
  }
};

export { variables, dbConnect };
