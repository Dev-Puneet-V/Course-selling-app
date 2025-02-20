import express from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { variables } from "../utils/config.js";
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;
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
  } catch (error) {
    if (error.code === 11000) {
      error.message = "User already exists";
      error.status = 409;
    }
    res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }
});

router.post("/signin", async (req, res) => {
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
    const user = await User.findOne({
      email: email.toLowerCase(),
    });
    if (!user) {
      let error = new Error("Password/Email invalid");
      error.status = 401;
      throw error;
    }
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      let error = new Error("Password/Email invalid");
      error.status = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id,
      },
      variables.JWT_TOKEN_SECRET,
      {
        expiresIn: variables.JWT_EXPIRY,
      }
    );
    res.cookie("token", token, {
      // httpOnly: true, // Prevents client-side access via JavaScript
      secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
      maxAge: variables.JWT_EXPIRY, // 1 day in milliseconds
      // sameSite: "strict", // Helps prevent CSRF attacks
    });
    user.password = undefined;
    user.__v = undefined;
    user.subscriptions = undefined;
    res.status(200).json({
      message: "User successfully logged in",
      data: user,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }
});
// router.get("/courses", (req, res) => {});
export default router;
