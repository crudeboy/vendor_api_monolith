"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.JWT_SECRET = exports.MONGO_URI = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.MONGO_URI = "mongodb+srv://jazz_d_dev:b1vqIzBD2ch3lRzt@cluster0.pcvx8gm.mongodb.net/?retryWrites=true&w=majority";
exports.JWT_SECRET = "1234QWERASDFZXCV12QWDFQADSFERwefwefwrv";
exports.PORT = process.env.PORT;
console.log(exports.PORT, "Port in config file");
//# sourceMappingURL=index.js.map