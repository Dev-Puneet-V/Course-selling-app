import mongoose from "mongoose";

interface Iuser {
  toObject(): unknown;
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  subscriptions?: mongoose.Types.ObjectId[];
  verifyPassword: (password: string) => Promise<boolean>;
  __v?: number;
}

export type { Iuser };
