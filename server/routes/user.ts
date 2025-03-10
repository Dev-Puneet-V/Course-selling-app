import express, { Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { variables } from "../utils/config.js";
import Course from "../models/course.js";
import { auth } from "../utils/middleware.js";
import { Iuser } from "../utils/types/user.js";
import { AuthenticatedRequest } from "../utils/types/common.js";
import { Icourse } from "../utils/types/course.js";
const router = express.Router();

router.get(
  "/me",
  auth,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const user = req.user;
      let planeUserObject = user?.toObject();
      if (typeof planeUserObject === "object" && planeUserObject !== null) {
        res.status(200).json({
          message: "User successfully logged in",
          data: {
            ...planeUserObject,
            password: undefined,
            subscriptions: undefined,
            __v: undefined,
          },
        });
      }
    } catch (error: any) {
      res.status(404).json({
        message: "User not found",
      });
    }
  }
);

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const user = z
      .object({
        name: z.string().min(3).max(15),
        email: z.string().email().toLowerCase(),
        password: z
          .string()
          .min(5)
          .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
          .regex(/[a-z]/, "Password must contain at least one lowercase letter")
          .regex(/[0-9]/, "Password must contain at least one number")
          .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character"
          ),
        confirmPassword: z.string(),
        role: z.enum(["admin", "user"]),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    user.parse(req.body);
    await User.create({
      name,
      email: email?.toLowerCase(),
      password,
      role,
    });
    res.status(200).json({
      message: "User successfully created",
    });
  } catch (error: any) {
    if (error.code === 11000) {
      error.message = "User already exists";
      error.status = 409;
    }
    res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userObject = z.object({
      email: z.string().email().toLowerCase(),
      password: z
        .string()
        .min(5)
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
          /[^A-Za-z0-9]/,
          "Password must contain at least one special character"
        ),
    });
    userObject.parse(req.body);
    const user: Iuser | null = await User.findOne({
      email: email.toLowerCase(),
    });
    if (!user) {
      let error: any = new Error("Password/Email invalid");
      error.status = 401;
      throw error;
    }
    const isPasswordValid: boolean = await user.verifyPassword(password);

    if (!isPasswordValid) {
      let error: any = new Error("Password/Email invalid");
      error.status = 401;
      throw error;
    }
    const token: string = jwt.sign(
      {
        userId: user._id,
      },
      variables.JWT_TOKEN_SECRET,
      {
        expiresIn: 86400000,
      }
    );
    res.cookie("token", token, {
      // httpOnly: true, // Prevents client-side access via JavaScript
      secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
      maxAge: 86400000, // 1 day in milliseconds
      sameSite: "none", // Helps prevent CSRF attacks
    });
    let planeUserObject = user.toObject();
    if (typeof planeUserObject === "object" && planeUserObject !== null) {
      res.status(200).json({
        message: "User successfully logged in",
        data: {
          ...planeUserObject,
          password: undefined,
          subscriptions: undefined,
          __v: undefined,
        },
      });
    } else {
      res.status(500).json({
        message: "Error processing user data",
      });
    }
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }
});

router.get(
  "/cources",
  auth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const cources = await Course.find({
        owner: user?._id,
      }).populate("contents");
      res.status(200).json({
        message: "Cources",
        data: cources,
      });
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 500).json({
        message: "Error fetching cources",
      });
    }
  }
);

router.get(
  "/:userId/courses",
  auth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId } = req.params;
      let courses: Icourse[] = await Course.find({
        owner: userId,
      }).lean();
      courses = courses?.map((course: any) => {
        return {
          ...course,
          owner: undefined,
          contents: undefined,
          subscribers: undefined,
          __v: undefined,
        };
      });
      res.status(200).json({
        message: "Courses fetched successfulyy",
        data: courses,
      });
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 500).json({
        message: "Error fetching cources",
      });
    }
  }
);

export default router;
