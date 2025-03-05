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
exports.auth = exports.isAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const config_1 = require("./config");
const isAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "admin") {
        next();
    }
    else {
        res.status(403).json({
            message: "User is forbidden to access this resourse",
        });
    }
};
exports.isAdmin = isAdmin;
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let authToken = req.headers.authorization || req.cookies.token;
        console.log(authToken);
        if (!authToken) {
            res.status(401).json({
                message: "User is unauthorized",
            });
        }
        else {
            if (authToken.split(" ")[0] === "Bearer") {
                authToken = authToken.split(" ")[1];
            }
            const decoded = jsonwebtoken_1.default.verify(authToken, config_1.variables.JWT_TOKEN_SECRET);
            const user = yield user_1.default.findById(decoded.userId).select("-password");
            if (!user) {
                const error = new Error("Unauthorized");
                error.status = 401;
                throw error;
            }
            req.user = user;
            next();
        }
    }
    catch (err) {
        res.status(401).json({
            message: "User is unauthorized",
        });
    }
});
exports.auth = auth;
