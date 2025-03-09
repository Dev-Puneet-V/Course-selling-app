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
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_js_1 = __importDefault(require("../models/user.js"));
const config_js_1 = require("../utils/config.js");
const course_js_1 = __importDefault(require("../models/course.js"));
const middleware_js_1 = require("../utils/middleware.js");
const router = express_1.default.Router();
router.get("/me", middleware_js_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        let planeUserObject = user === null || user === void 0 ? void 0 : user.toObject();
        if (typeof planeUserObject === "object" && planeUserObject !== null) {
            res.status(200).json({
                message: "User successfully logged in",
                data: Object.assign(Object.assign({}, planeUserObject), { password: undefined, subscriptions: undefined, __v: undefined }),
            });
        }
    }
    catch (error) {
        res.status(404).json({
            message: "User not found",
        });
    }
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        const user = zod_1.z
            .object({
            name: zod_1.z.string().min(3).max(15),
            email: zod_1.z.string().email().toLowerCase(),
            password: zod_1.z
                .string()
                .min(5)
                .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                .regex(/[a-z]/, "Password must contain at least one lowercase letter")
                .regex(/[0-9]/, "Password must contain at least one number")
                .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
            confirmPassword: zod_1.z.string(),
            role: zod_1.z.enum(["admin", "user"]),
        })
            .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords don't match",
            path: ["confirmPassword"],
        });
        user.parse(req.body);
        yield user_js_1.default.create({
            name,
            email: email === null || email === void 0 ? void 0 : email.toLowerCase(),
            password,
            role,
        });
        res.status(200).json({
            message: "User successfully created",
        });
    }
    catch (error) {
        if (error.code === 11000) {
            error.message = "User already exists";
            error.status = 409;
        }
        res.status(error.status || 500).json({
            message: error.message || "Internal server error",
        });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userObject = zod_1.z.object({
            email: zod_1.z.string().email().toLowerCase(),
            password: zod_1.z
                .string()
                .min(5)
                .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                .regex(/[a-z]/, "Password must contain at least one lowercase letter")
                .regex(/[0-9]/, "Password must contain at least one number")
                .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
        });
        userObject.parse(req.body);
        const user = yield user_js_1.default.findOne({
            email: email.toLowerCase(),
        });
        if (!user) {
            let error = new Error("Password/Email invalid");
            error.status = 401;
            throw error;
        }
        const isPasswordValid = yield user.verifyPassword(password);
        if (!isPasswordValid) {
            let error = new Error("Password/Email invalid");
            error.status = 401;
            throw error;
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
        }, config_js_1.variables.JWT_TOKEN_SECRET, {
            expiresIn: 86400000,
        });
        res.cookie("token", token, {
            // httpOnly: true, // Prevents client-side access via JavaScript
            secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
            maxAge: 86400000, // 1 day in milliseconds
            // sameSite: "strict", // Helps prevent CSRF attacks
        });
        let planeUserObject = user.toObject();
        if (typeof planeUserObject === "object" && planeUserObject !== null) {
            res.status(200).json({
                message: "User successfully logged in",
                data: Object.assign(Object.assign({}, planeUserObject), { password: undefined, subscriptions: undefined, __v: undefined }),
            });
        }
        else {
            res.status(500).json({
                message: "Error processing user data",
            });
        }
    }
    catch (error) {
        res.status(error.status || 500).json({
            message: error.message || "Internal server error",
        });
    }
}));
router.get("/cources", middleware_js_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const cources = yield course_js_1.default.find({
            owner: user === null || user === void 0 ? void 0 : user._id,
        }).populate("contents");
        res.status(200).json({
            message: "Cources",
            data: cources,
        });
    }
    catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            message: "Error fetching cources",
        });
    }
}));
router.get("/:userId/courses", middleware_js_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        let courses = yield course_js_1.default.find({
            owner: userId,
        }).lean();
        courses = courses === null || courses === void 0 ? void 0 : courses.map((course) => {
            return Object.assign(Object.assign({}, course), { owner: undefined, contents: undefined, subscribers: undefined, __v: undefined });
        });
        res.status(200).json({
            message: "Courses fetched successfulyy",
            data: courses,
        });
    }
    catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            message: "Error fetching cources",
        });
    }
}));
exports.default = router;
