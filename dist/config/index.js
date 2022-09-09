"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.JWT_SECRET = exports.MONGO_URI = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.MONGO_URI = process.env.MONGO_URI;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.PORT = process.env.PORT;
console.log(exports.PORT, "Port in config file");
//# sourceMappingURL=index.js.map