import jwt from "jsonwebtoken";
import User from "../models/user";
import { variables } from "./config";
import {
  AuthenticatedRequest,
  IAuthRequest,
  IJwtDecoded,
} from "./types/common.js";
import { Request, NextFunction, Response } from "express";

export const isAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "User is forbidden to access this resourse",
    });
  }
};

export const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Try to get token from cookies first, then authorization header
    let token = req.cookies.token;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      res.status(401).json({
        message: "Authentication required. Please login.",
      });
      return;
    }

    const decoded: IJwtDecoded = jwt.verify(
      token,
      variables.JWT_TOKEN_SECRET
    ) as IJwtDecoded;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401).json({
        message: "User not found or invalid token.",
      });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({
      message: "Invalid or expired token. Please login again.",
    });
  }
};
