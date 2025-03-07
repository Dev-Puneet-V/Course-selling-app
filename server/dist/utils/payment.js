"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
const instance = new razorpay_1.default({
    // key_id: variables.RAZORPAY_KEY_ID || "rzp_test_r9x0083Lr1W1nI",
    // key_secret: variables.RAZORPAY_KEY_SECRET || "to6zeo3KtATuNruXklQ1uuRP",
    key_id: "rzp_test_r9x0083Lr1W1nI",
    key_secret: "to6zeo3KtATuNruXklQ1uuRP",
});
exports.default = instance;
