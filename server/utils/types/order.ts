import mongoose from "mongoose";

interface IOrder {
  user: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "paid" | "failed";
  razorpayOrderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type { IOrder };
