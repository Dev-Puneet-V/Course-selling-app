import express from "express";
import userRouter from "./user";
import courseRouter from "./course";
import paymentRouter from "./payment";
const router = express.Router();

router.use("/user", userRouter);
router.use("/course", courseRouter);
router.use("/payment", paymentRouter);
export default router;
