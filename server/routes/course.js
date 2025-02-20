import express from "express";
import fs from "fs";
import { z } from "zod";
import { auth, isAdmin } from "../utils/middleware.js";
import { upload, uploadToCloudinary } from "../utils/fileUpload.js";
import Course from "../models/course.js";
const router = express.Router();

router.post("/", auth, isAdmin, upload.single("course"), async (req, res) => {
  try {
    const user = req.user;
    const { name, price, description } = req.body;
    const courseObject = z.object({
      name: z.string().min(3).max(20),
      price: z.number().min(0),
      description: z.string().min(10),
    });
    courseObject.parse({
      ...req.body,
      price: +price,
    });
    const uploadedFile = await uploadToCloudinary(req.file.path);
    const { secure_url, public_id } = uploadedFile;

    const newCourse = await Course.create({
      name,
      price: +price,
      description,
      image: {
        url: secure_url,
        publicId: public_id,
      },
      owner: user,
    });
    res.status(200).json({
      message: "Successfully created new course",
      data: newCourse,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      error.status = 409;
    }
    res.status(error.status || 500).json({
      message: error.message || "Error creating new course",
    });
  } finally {
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

router.delete("/:courseId", auth, isAdmin, (req, res) => {});
router.put("/:courseId", auth, isAdmin, (req, res) => {});

router.put(
  "/:courseId/remove-content/:contentId",
  auth,
  isAdmin,
  (req, res) => {}
);
router.put(
  "/:courseId/update-content/:contentId",
  auth,
  isAdmin,
  (req, res) => {}
);

router.get("/:courseId/content", auth, (req, res) => {});
export default router;
