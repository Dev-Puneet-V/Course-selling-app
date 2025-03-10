import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

interface ConfigVariableType {
  PORT: string | number;
  NODE_ENV: string;
  MONGODB_URI: string;
  JWT_TOKEN_SECRET: string;
  JWT_EXPIRY: string | undefined;
  CLOUDINARY_CLOUD_NAME: string | undefined;
  CLOUDINARY_API_KEY: string | undefined;
  CLOUDINARY_API_SECRET: string | undefined;
  RAZORPAY_KEY_ID: string | undefined;
  RAZORPAY_KEY_SECRET: string | undefined;
  CORS_ORIGIN: string;
  CLOUDINARY_CONFIG: {
    cloud_name: string | undefined;
    api_key: string | undefined;
    api_secret: string | undefined;
  };
}

const variables: ConfigVariableType = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/courseapp",
  JWT_TOKEN_SECRET:
    process.env.JWT_TOKEN_SECRET || "your_development_jwt_secret",
  JWT_EXPIRY: process.env.JWT_EXPIRY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  CLOUDINARY_CONFIG: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
};

const dbConnect = async () => {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("DB connected successfully");
  } catch (error) {
    throw new Error("Error connection error");
  }
};

// Validate required environment variables
const requiredEnvVars = [
  "MONGO_URI",
  "JWT_TOKEN_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export { variables, dbConnect };
