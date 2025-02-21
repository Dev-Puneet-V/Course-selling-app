import Razorpay from "razorpay";
import { variables } from "./config.js";
const instance = new Razorpay({
  key_id: "rzp_test_r9x0083Lr1W1nI" || variables.RAZORPAY_KEY_ID,
  key_secret: "to6zeo3KtATuNruXklQ1uuRP" || variables.RAZORPAY_KEY_SECRET,
});

export default instance;
