import express, { Response } from "express";
import fs from "fs";
import { z } from "zod";
import { auth, isAdmin } from "../utils/middleware";
import { upload, uploadToCloudinary } from "../utils/fileUpload";
import Course from "../models/course";
import Content from "../models/content";
import { AuthenticatedRequest } from "../utils/types/common";
import { Icourse } from "../utils/types/course";
const router = express.Router();

router.get("/all", auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type = "unpurchased" } = req.query;
    const user = req.user;
    let cources = await Course.find({
      "subscribers.user":
        type === "unpurchased" ? { $ne: user?._id } : user?._id,
    }).populate("contents");
    res.status(200).json({
      message: "Cources fetched successfully",
      data: cources,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: "Error fetching cources",
    });
  }
});

router.get("/:id", auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const course = await Course.findOne({
      _id: id,
      $or: [{ owner: user?._id }, { subscribers: user?._id }],
    }).populate("contents");
    res.status(200).json({
      message: "Course found successfully",
      data: course,
    });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({
      message: "Course not found",
    });
  }
});

router.post(
  "/",
  auth,
  isAdmin,
  upload.single("course"),
  async (req: AuthenticatedRequest, res: Response) => {
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
      const uploadedFile = await uploadToCloudinary(req.file?.path);
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
    } catch (error: any) {
      console.error(error);
      if (error.code === 11000) {
        error.status = 409;
      }
      res.status(error.status || 500).json({
        message: error.message || "Error creating new course",
      });
    } finally {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
  }
);

router.delete(
  "/:courseId",
  auth,
  isAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId } = req.params;
      const course = await Course.findOneAndDelete({
        owner: req.user?._id,
        _id: courseId,
      });
      if (!course) {
        const error: any = new Error("Course not found");
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
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 500).json({
        message: error.message || "Error deleting course",
      });
    }
  }
);

// add new content to a course
router.post(
  "/:courseId/content",
  auth,
  isAdmin,
  upload.single("content"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId } = req.params;
      const { contentType, topic } = req.body;
      const contentObject = z.object({
        contentType: z.enum(["video", "pdf"]),
        topic: z.string().min(10),
      });
      contentObject.parse(req.body);
      const course = await Course.findOne({
        _id: courseId,
        owner: req.user?._id,
      });
      if (!course) {
        const error: any = new Error("Course not found");
        error.status = 404;
        throw error;
      }
      const uploadedFile = await uploadToCloudinary(req.file?.path);
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
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 500).json({
        message: error.message || "Error adding new content",
      });
    } finally {
      if (req.file && fs.existsSync(req.file?.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
  }
);

router.put(
  "/:courseId",
  auth,
  isAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
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
          owner: req.user?._id,
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
        const error: any = new Error("Course not found");
        error.status = 404;
        throw error;
      }
      res.status(200).json({
        message: "Course details updated successfully",
      });
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 500).json({
        message: error.messag || "Internal server error",
      });
    }
  }
);

router.delete(
  "/:courseId/content/:contentId",
  auth,
  isAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId, contentId } = req.params;
      const course = await Course.findOne({
        _id: courseId,
        owner: req.user?._id,
      });
      if (!course) {
        const error: any = new Error("Course not found");
        error.status = 404;
        throw error;
      }
      const contentExists = course?.contents?.some(
        (content) => String(content) === contentId
      );
      if (!contentExists) {
        const error: any = new Error("Content not found");
        error.status = 404;
        throw error;
      }
      await Content.findByIdAndDelete(contentId);
      res.status(200).json({
        message: "Successfully content deleted",
      });
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 500).json({
        message: error.messag || "Internal server error",
      });
    }
  }
);

export default router;

//user -> see course -> click on purchase -> once clicked on purchase -> buy it and save to db ->
