import { v2 as cloudinary, uploader } from "cloudinary";
import multer from "multer";
import path from "path";
import fs from "fs";
import { variables } from "./config";
cloudinary.config({
  cloud_name: variables.CLOUDINARY_CLOUD_NAME,
  api_key: variables.CLOUDINARY_API_KEY,
  api_secret: variables.CLOUDINARY_API_SECRET,
  timeout: 300000,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage: storage });

const uploadToCloudinary = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found: " + filePath);
    }
    console.log(filePath);
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      chunk_size: 6000000,
    });
    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

const deleteResourceFromClodinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Clodinary resource delete error", error);
    throw error;
  }
};

const overwriteResourceInCloudinary = async (filePath, publicId) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export {
  upload,
  uploadToCloudinary,
  deleteResourceFromClodinary,
  overwriteResourceInCloudinary,
};
