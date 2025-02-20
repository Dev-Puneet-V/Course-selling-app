import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { variables } from "./config.js";
export const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "User is forbidden to access this resourse",
    });
  }
};

export const auth = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) {
      res.status(401).json({
        message: "User is unauthorized",
      });
    } else {
      const decoded = jwt.verify(
        authToken.split(" ")[1],
        variables.JWT_TOKEN_SECRET
      );
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        const error = new Error("Unauthorized");
        error.status(401);
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
