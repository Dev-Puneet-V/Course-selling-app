import express from "express";
import crypto from "crypto";
import Course from "../models/course.js";
import Order from "../models/order.js";
import UserCourse from "../models/courseContent.js";
import paymentInstance from "../utils/payment.js";
import { auth } from "../utils/middleware.js";
import { variables } from "../utils/config.js";
import courseContent from "../models/courseContent.js";
const router = express.Router();

//create order
router.post("/request/:courseId", auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }
    const orderRequest = await paymentInstance.orders.create({
      amount: course.price * 100,
      currency: "INR",
      receipt: `Receipt for Course Purchase`,
    });
    const orderExist = await Order.findOne({
      user: req.user._id,
      course: course._id,
    });
    if (orderExist) {
      const error = new Error("Order already exist");
      error.status = 409;
      throw error;
    }
    await Order.create({
      user: req.user._id,
      seller: course.owner,
      amount: course.price,
      course: course._id,
      razorpayOrderId: orderRequest.id,
    });
    res.status(200).json({
      message: "Order request successfully created",
      data: orderRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: "Error creating order",
    });
  }
});

router.post("/confirm", auth, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    if (!orderId || !paymentId || !signature) {
      const error = new Error("orderId or paymentId or signature not found");
      error.status = 400;
      throw error;
    }
    const order = await Order.findOne({
      razorpayOrderId: orderId,
      user: req.user._id,
    });
    if (!order) {
      const error = new Error("Order not found");
      error.status = 404;
      throw error;
    }
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        "to6zeo3KtATuNruXklQ1uuRP" || variables.RAZORPAY_KEY_SECRET
      )
      .update(orderId + "|" + paymentId)
      .digest("hex");
    if (generatedSignature === signature) {
      order.status = "paid";
      await order.save();
      await courseContent.create({
          subscriber: order.user._id,
          course: order.course
      });
      return res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      order.status = "failed";
      await order.save();
      const error = new Error("Invalid payment signature");
      error.status = 400;
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: "Error in payment",
    });
  }
});
export default router;
