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
    const authToken = req.headers.authorization;
    if (!authToken) {
      res.status(401).json({
        message: "User is unauthorized",
      });
    } else {
      const decoded: IJwtDecoded = jwt.verify(
        authToken.split(" ")[1],
        variables.JWT_TOKEN_SECRET
      ) as IJwtDecoded;
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        const error: any = new Error("Unauthorized");
        error.status = 401;
        throw error;
      }
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(401).json({
      message: "User is unauthorized",
    });
  }
};
