import express, { Request, Response } from "express";
import crypto from "crypto";
import Course from "../models/course";
import Order from "../models/order";
import UserCourse from "../models/courseContent";
import paymentInstance from "../utils/payment";
import { auth } from "../utils/middleware";
import { variables } from "../utils/config";
import courseContent from "../models/courseContent";
import { AuthenticatedRequest } from "../utils/types/common";
import order from "../models/order";
import mongoose from "mongoose";
const router = express.Router();

//create order
router.post(
  "/request/:courseId",
  auth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { courseId } = req.params;
      const course = await Course.findById(courseId);
      if (!course) {
        const error: any = new Error("Course not found");
        error.status = 404;
        throw error;
      }
      const orderRequest = await paymentInstance.orders.create({
        amount: course.price * 100,
        currency: "INR",
        receipt: `Receipt for Course Purchase`,
      });
      const orderExist = await Order.findOne({
        user: req.user?._id,
        course: course._id,
      });
      if (orderExist) {
        if (orderExist?.status === "paid") {
          const error: any = new Error("Order already exist");
          error.status = 409;
          throw error;
        } else {
          orderExist.status = "pending";
          orderExist.razorpayOrderId = orderRequest.id;
          await orderExist.save();
          console.log(orderExist);
        }
      } else {
        await Order.create({
          user: req.user?._id,
          seller: course.owner,
          amount: course.price,
          course: course._id,
          razorpayOrderId: orderRequest.id,
        });
      }
      res.status(200).json({
        message: "Order request successfully created",
        data: orderRequest,
      });
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 500).json({
        message: "Error creating order",
      });
    }
  }
);

router.post(
  "/confirm",
  auth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { orderId, paymentId, signature } = req.body;
      if (!orderId || !paymentId || !signature) {
        const error: any = new Error(
          "orderId or paymentId or signature not found"
        );
        error.status = 400;
        throw error;
      }
      const order = await Order.findOne({
        razorpayOrderId: orderId,
        user: new mongoose.Types.ObjectId(req.user?._id),
      });
      if (!order) {
        const error: any = new Error("Order not found");
        error.status = 404;
        throw error;
      }
      const generatedSignature = crypto
        .createHmac("sha256", "to6zeo3KtATuNruXklQ1uuRP")
        .update(orderId + "|" + paymentId)
        .digest("hex");

      if (generatedSignature === signature) {
        order.status = "paid";
        await order.save();
        await courseContent.create({
          subscriber: order.user._id,
          course: order.course,
        });
        await Course.findOneAndUpdate(
          { _id: order?.course },
          {
            $push: {
              subscribers: {
                user: req.user?._id,
                joinedAt: new Date(),
              },
            },
          }
        );
        res.json({
          success: true,
          message: "Payment verified successfully",
        });
      } else {
        order.status = "failed";
        await order.save();
        const error: any = new Error("Invalid payment signature");
        error.status = 400;
        throw error;
      }
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 500).json({
        message: "Error in payment",
      });
    }
  }
);
export default router;
