import jwt from "jsonwebtoken";
import { variables } from "./config.js";
export const isAdmin = (req, res, next) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    res.status(403).json({
      message: "User is forbidden to access this resourse",
    });
  }
};

export const auth = (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) {
      res.status(401).json({
        message: "User is unauthorized",
      });
    } else {
      const decoded = jwt.verify(authToken, variables.JWT_TOKEN_SECRET);
      req.user = decoded.user;
      next();
    }
  } catch (err) {
    res.status(401).json({
      message: "User is unauthorized",
    });
  }
};
