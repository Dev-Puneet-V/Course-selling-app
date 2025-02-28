import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

interface ConfigVariableType {
  PORT: string | number;
  JWT_TOKEN_SECRET: string;
  JWT_EXPIRY: string | undefined;
  CLOUDINARY_CLOUD_NAME: string | undefined;
  CLOUDINARY_API_KEY: string | undefined;
  CLOUDINARY_API_SECRET: string | undefined;
  RAZORPAY_KEY_ID: string | undefined;
  RAZORPAY_KEY_SECRET: string | undefined;
}

const variables: ConfigVariableType = {
  PORT: process.env.PORT || 3000,
  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET || "",
  JWT_EXPIRY: process.env.JWT_EXPIRY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_ID,
};

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("DB connected successfully");
  } catch (error) {
    throw new Error("Error connection error");
  }
};

export { variables, dbConnect };
