import express from "express";
import fs from "fs";
import { z } from "zod";
import { auth, isAdmin } from "../utils/middleware.js";
import { upload, uploadToCloudinary } from "../utils/fileUpload.js";
import Course from "../models/course.js";
import Content from "../models/content.js";
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

router.delete("/:courseId", auth, isAdmin, async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOneAndDelete({
      owner: req.user._id,
      _id: courseId,
    });
    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }

    //TODO: dont block here
    await Promise.all(
      course?.contents.map((content) => {
        return Content.findByIdAndDelete(content);
      })
    );

    res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Error deleting course",
    });
  }
});

// add new content to a course
router.post(
  "/:courseId/content",
  auth,
  isAdmin,
  upload.single("content"),
  async (req, res) => {
    try {
      const { courseId } = req.params;
      const { contentType, topic } = req.body;
      console.log(req.body);
      const contentObject = z.object({
        contentType: z.enum(["video", "pdf"]),
        topic: z.string().min(10),
      });
      contentObject.parse(req.body);
      const course = await Course.findOne({
        _id: courseId,
        owner: req.user._id,
      });
      if (!course) {
        const error = new Error("Course not found");
        error.status = 404;
        throw error;
      }
      const uploadedFile = await uploadToCloudinary(req.file.path);
      const { secure_url, public_id } = uploadedFile;
      const newContent = await Content.create({
        contentType,
        topic,
        content: {
          url: secure_url,
          publicId: public_id,
        },
      });
      course.contents.push(newContent?._id);
      await course.save();
      res.status(200).json({
        message: "successfully content created",
        data: newContent,
      });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({
        message: error.message || "Error adding new content",
      });
    } finally {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
  }
);

router.put("/:courseId", auth, isAdmin, async (req, res) => {
  try {
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
    const { courseId } = req.params;
    const course = await Course.findOneAndUpdate(
      {
        owner: req.user._id,
        _id: courseId,
      },
      {
        name,
        price,
        description,
      },
      { new: true, runValidators: true }
    );
    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({
      message: "Course details updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.messag || "Internal server error",
    });
  }
});

router.delete(
  "/:courseId/content/:contentId",
  auth,
  isAdmin,
  async (req, res) => {
    try {
      const { courseId, contentId } = req.params;
      const course = await Course.findOne({
        _id: courseId,
        owner: req.user._id,
      });
      if (!course) {
        const error = new Error("Course not found");
        error.status = 404;
        throw error;
      }
      const contentExists = course?.contents?.some(
        (content) => String(content) === contentId
      );
      if (!contentExists) {
        const error = new Error("Content not found");
        error.status = 404;
        throw error;
      }
      await Content.findByIdAndDelete(contentId);
      res.status(200).json({
        message: "Successfully content deleted",
      });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({
        message: error.messag || "Internal server error",
      });
    }
  }
);
// TODO - implement it when user has access to it
router.get("/:courseId/content", auth, (req, res) => {});
export default router;

//user -> see course -> click on purchase -> once clicked on purchase -> buy it and save to db -> 
