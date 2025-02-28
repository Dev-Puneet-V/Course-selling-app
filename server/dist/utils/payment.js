"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
const config_js_1 = require("./config.js");
const instance = new razorpay_1.default({
    key_id: config_js_1.variables.RAZORPAY_KEY_ID || "rzp_test_r9x0083Lr1W1nI",
    key_secret: config_js_1.variables.RAZORPAY_KEY_SECRET || "to6zeo3KtATuNruXklQ1uuRP",
});
exports.default = instance;
