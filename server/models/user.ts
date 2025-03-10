import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Iuser } from "../../server/utils/types/user";
const userSchema = new mongoose.Schema<Iuser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  subscriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  try {
    const encryptPassword = await bcrypt.hash(this.password, 5);
    this.password = encryptPassword;
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.verifyPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
