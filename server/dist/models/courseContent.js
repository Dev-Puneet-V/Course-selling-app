"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userCourseSchema = new mongoose_1.default.Schema({
    subscriber: {
        ref: "User",
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    course: {
        ref: "Course",
        required: true,
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    currentContent: {
        ref: "Content",
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    watchedContent: [
        {
            ref: "Content",
            type: mongoose_1.default.Schema.Types.ObjectId,
        },
    ],
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("UserCourse", userCourseSchema);
