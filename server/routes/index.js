import express from "express";
import userRouter from "./user.js";
import courseRouter from "./course.js";
import paymentRouter from "./payment.js";
const router = express.Router();

router.use("/user", userRouter);
router.use("/course", courseRouter);
router.use("/payment", paymentRouter);
export default router;
