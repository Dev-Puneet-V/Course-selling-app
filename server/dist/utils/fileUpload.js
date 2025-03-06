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
exports.overwriteResourceInCloudinary = exports.deleteResourceFromClodinary = exports.uploadToCloudinary = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_js_1 = require("./config.js");
cloudinary_1.v2.config({
    cloud_name: config_js_1.variables.CLOUDINARY_CLOUD_NAME,
    api_key: config_js_1.variables.CLOUDINARY_API_KEY,
    api_secret: config_js_1.variables.CLOUDINARY_API_SECRET,
    timeout: 300000,
});
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
exports.upload = upload;
const uploadToCloudinary = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error("File not found: " + filePath);
        }
        const result = yield cloudinary_1.v2.uploader.upload(filePath, {
            resource_type: "auto",
            chunk_size: 6000000,
            access_mode: "public",
        });
        return result;
    }
    catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
});
exports.uploadToCloudinary = uploadToCloudinary;
const deleteResourceFromClodinary = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cloudinary_1.v2.uploader.destroy(publicId);
    }
    catch (error) {
        console.error("Clodinary resource delete error", error);
        throw error;
    }
});
exports.deleteResourceFromClodinary = deleteResourceFromClodinary;
const overwriteResourceInCloudinary = (filePath, publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.v2.uploader.upload(filePath, {
            public_id: publicId,
            overwrite: true,
        });
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.overwriteResourceInCloudinary = overwriteResourceInCloudinary;
