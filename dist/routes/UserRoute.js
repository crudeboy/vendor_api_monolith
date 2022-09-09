"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
var express_1 = __importDefault(require("express"));
var UserController_1 = require("../controllers/UserController");
var middlewares_1 = require("../middlewares");
var router = express_1.default.Router();
exports.UserRoute = router;
// sign up / create customer
router.post('/signup', UserController_1.CustomerSignUp);
// login
router.post('/login', UserController_1.CustomerLogin);
router.use(middlewares_1.Authenticate);
// verify custoimer account
router.post('/verify', UserController_1.CustomerVerify);
//OTP / request OTP
router.get('/otp', UserController_1.RequestOtp);
//Profile
router.get('/profile', UserController_1.GetCustomerProfile);
router.patch('/profile', UserController_1.EditCustomerProfile);
//# sourceMappingURL=UserRoute.js.map