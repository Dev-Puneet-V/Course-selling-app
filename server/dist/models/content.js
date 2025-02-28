"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contentSchema = new mongoose_1.default.Schema({
    contentType: {
        type: String,
        enum: ["video", "pdf"],
    },
    topic: {
        type: String,
        required: true,
    },
    content: {
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Content", contentSchema);
