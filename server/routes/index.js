import express from "express";
import userRouter from "./user.js";
import courseRouter from "./course.js";
const router = express.Router();

router.use("/user", userRouter);
router.use("/course", courseRouter);

export default router;
