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
const fs_1 = __importDefault(require("fs"));
const zod_1 = require("zod");
const middleware_1 = require("../utils/middleware");
const fileUpload_1 = require("../utils/fileUpload");
const course_1 = __importDefault(require("../models/course"));
const content_1 = __importDefault(require("../models/content"));
const router = express_1.default.Router();
router.get("/:id", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = req.user;
        const course = yield course_1.default.findOne({
            _id: id,
            owner: user === null || user === void 0 ? void 0 : user._id,
        }).populate("contents");
        res.status(200).json({
            message: "Course found successfully",
            data: course,
        });
    }
    catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            message: "Course not found",
        });
    }
}));
router.post("/", middleware_1.auth, middleware_1.isAdmin, fileUpload_1.upload.single("course"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user = req.user;
        const { name, price, description } = req.body;
        const courseObject = zod_1.z.object({
            name: zod_1.z.string().min(3).max(20),
            price: zod_1.z.number().min(0),
            description: zod_1.z.string().min(10),
        });
        courseObject.parse(Object.assign(Object.assign({}, req.body), { price: +price }));
        const uploadedFile = yield (0, fileUpload_1.uploadToCloudinary)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
        const { secure_url, public_id } = uploadedFile;
        const newCourse = yield course_1.default.create({
            name,
            price: +price,
            description,
            image: {
                url: secure_url,
                publicId: public_id,
            },
            owner: user,
        });
        res.status(200).json({
            message: "Successfully created new course",
            data: newCourse,
        });
    }
    catch (error) {
        console.error(error);
        if (error.code === 11000) {
            error.status = 409;
        }
        res.status(error.status || 500).json({
            message: error.message || "Error creating new course",
        });
    }
    finally {
        if (((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) && fs_1.default.existsSync(req.file.path)) {
            fs_1.default.unlinkSync(req.file.path);
        }
    }
}));
router.delete("/:courseId", middleware_1.auth, middleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { courseId } = req.params;
        const course = yield course_1.default.findOneAndDelete({
            owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            _id: courseId,
        });
        if (!course) {
            const error = new Error("Course not found");
            error.status = 404;
            throw error;
        }
        //TODO: dont block here
        yield Promise.all(course === null || course === void 0 ? void 0 : course.contents.map((content) => {
            return content_1.default.findByIdAndDelete(content);
        }));
        res.status(200).json({
            message: "Course deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            message: error.message || "Error deleting course",
        });
    }
}));
// add new content to a course
router.post("/:courseId/content", middleware_1.auth, middleware_1.isAdmin, fileUpload_1.upload.single("content"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { courseId } = req.params;
        const { contentType, topic } = req.body;
        console.log(req.body);
        const contentObject = zod_1.z.object({
            contentType: zod_1.z.enum(["video", "pdf"]),
            topic: zod_1.z.string().min(10),
        });
        contentObject.parse(req.body);
        const course = yield course_1.default.findOne({
            _id: courseId,
            owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        if (!course) {
            const error = new Error("Course not found");
            error.status = 404;
            throw error;
        }
        const uploadedFile = yield (0, fileUpload_1.uploadToCloudinary)((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
        const { secure_url, public_id } = uploadedFile;
        const newContent = yield content_1.default.create({
            contentType,
            topic,
            content: {
                url: secure_url,
                publicId: public_id,
            },
        });
        course.contents.push(newContent === null || newContent === void 0 ? void 0 : newContent._id);
        yield course.save();
        res.status(200).json({
            message: "successfully content created",
            data: newContent,
        });
    }
    catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            message: error.message || "Error adding new content",
        });
    }
    finally {
        if (req.file && fs_1.default.existsSync((_c = req.file) === null || _c === void 0 ? void 0 : _c.path)) {
            fs_1.default.unlinkSync(req.file.path);
        }
    }
}));
router.put("/:courseId", middleware_1.auth, middleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, price, description } = req.body;
        const courseObject = zod_1.z.object({
            name: zod_1.z.string().min(3).max(20),
            price: zod_1.z.number().min(0),
            description: zod_1.z.string().min(10),
        });
        courseObject.parse(Object.assign(Object.assign({}, req.body), { price: +price }));
        const { courseId } = req.params;
        const course = yield course_1.default.findOneAndUpdate({
            owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            _id: courseId,
        }, {
            name,
            price,
            description,
        }, { new: true, runValidators: true });
        if (!course) {
            const error = new Error("Course not found");
            error.status = 404;
            throw error;
        }
        res.status(200).json({
            message: "Course details updated successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            message: error.messag || "Internal server error",
        });
    }
}));
router.delete("/:courseId/content/:contentId", middleware_1.auth, middleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { courseId, contentId } = req.params;
        const course = yield course_1.default.findOne({
            _id: courseId,
            owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        if (!course) {
            const error = new Error("Course not found");
            error.status = 404;
            throw error;
        }
        const contentExists = (_b = course === null || course === void 0 ? void 0 : course.contents) === null || _b === void 0 ? void 0 : _b.some((content) => String(content) === contentId);
        if (!contentExists) {
            const error = new Error("Content not found");
            error.status = 404;
            throw error;
        }
        yield content_1.default.findByIdAndDelete(contentId);
        res.status(200).json({
            message: "Successfully content deleted",
        });
    }
    catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            message: error.messag || "Internal server error",
        });
    }
}));
// TODO - implement it when user has access to it
router.get("/:courseId/content", middleware_1.auth, (req, res) => { });
exports.default = router;
//user -> see course -> click on purchase -> once clicked on purchase -> buy it and save to db ->
