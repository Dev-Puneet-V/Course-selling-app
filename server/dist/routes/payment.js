"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const course_1 = __importDefault(require("../models/course"));
const order_1 = __importDefault(require("../models/order"));
const payment_1 = __importDefault(require("../utils/payment"));
const middleware_1 = require("../utils/middleware");
const courseContent_1 = __importDefault(require("../models/courseContent"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
//create order
router.post("/request/:courseId", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { courseId } = req.params;
        const course = yield course_1.default.findById(courseId);
        if (!course) {
            const error = new Error("Course not found");
            error.status = 404;
            throw error;
        }
        const orderRequest = yield payment_1.default.orders.create({
            amount: course.price * 100,
            currency: "INR",
            receipt: `Receipt for Course Purchase`,
        });
        const orderExist = yield order_1.default.findOne({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            course: course._id,
        });
        if (orderExist) {
            if ((orderExist === null || orderExist === void 0 ? void 0 : orderExist.status) === "paid") {
                const error = new Error("Order already exist");
                error.status = 409;
                throw error;
            }
            else {
                orderExist.status = "pending";
                orderExist.razorpayOrderId = orderRequest.id;
                yield orderExist.save();
                console.log(orderExist);
            }
        }
        else {
            yield order_1.default.create({
                user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
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
    }
    catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            message: "Error creating order",
        });
    }
}));
router.post("/confirm", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { orderId, paymentId, signature } = req.body;
        if (!orderId || !paymentId || !signature) {
            const error = new Error("orderId or paymentId or signature not found");
            error.status = 400;
            throw error;
        }
        const order = yield order_1.default.findOne({
            razorpayOrderId: orderId,
            user: new mongoose_1.default.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a._id),
        });
        if (!order) {
            const error = new Error("Order not found");
            error.status = 404;
            throw error;
        }
        const generatedSignature = crypto_1.default
            .createHmac("sha256", "to6zeo3KtATuNruXklQ1uuRP"
        // variables.RAZORPAY_KEY_SECRET || "to6zeo3KtATuNruXklQ1uuRP"
        )
            .update(orderId + "|" + paymentId)
            .digest("hex");
        if (generatedSignature === signature) {
            order.status = "paid";
            yield order.save();
            yield courseContent_1.default.create({
                subscriber: order.user._id,
                course: order.course,
            });
            res.json({
                success: true,
                message: "Payment verified successfully",
            });
        }
        else {
            order.status = "failed";
            yield order.save();
            const error = new Error("Invalid payment signature");
            error.status = 400;
            throw error;
        }
    }
    catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            message: "Error in payment",
        });
    }
}));
exports.default = router;
