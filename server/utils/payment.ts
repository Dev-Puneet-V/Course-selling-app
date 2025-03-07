import Razorpay from "razorpay";
import { variables } from "./config.js";
const instance = new Razorpay({
  // key_id: variables.RAZORPAY_KEY_ID || "rzp_test_r9x0083Lr1W1nI",
  // key_secret: variables.RAZORPAY_KEY_SECRET || "to6zeo3KtATuNruXklQ1uuRP",
  key_id:  "rzp_test_r9x0083Lr1W1nI",
  key_secret: "to6zeo3KtATuNruXklQ1uuRP",
});

export default instance;
