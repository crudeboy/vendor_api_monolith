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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
var Customer_dto_1 = require("../dto/Customer.dto");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var models_1 = require("../models");
var utility_1 = require("../utility");
var CustomerSignUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerInputs, InputErrors, email, phone, password, existingEmail, existingPhone, salt, userPassword, _a, otp, expiry, customer, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customerInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInputs, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } })];
            case 1:
                InputErrors = _b.sent();
                if (InputErrors.length) {
                    return [2 /*return*/, res.status(400).json(InputErrors)];
                }
                email = customerInputs.email, phone = customerInputs.phone, password = customerInputs.password;
                return [4 /*yield*/, models_1.Customer.findOne({ email: email })];
            case 2:
                existingEmail = _b.sent();
                if (existingEmail) {
                    return [2 /*return*/, res.status(409).json({ message: "A User exists with provided email." })];
                }
                return [4 /*yield*/, models_1.Customer.findOne({ phone: phone })];
            case 3:
                existingPhone = _b.sent();
                if (existingPhone) {
                    return [2 /*return*/, res.status(409).json({ message: "A User exists with provided phone." })];
                }
                return [4 /*yield*/, (0, utility_1.GenerateSalt)()];
            case 4:
                salt = _b.sent();
                return [4 /*yield*/, (0, utility_1.GeneratePassword)(password, salt)];
            case 5:
                userPassword = _b.sent();
                _a = (0, utility_1.GenerateOtp)(), otp = _a.otp, expiry = _a.expiry;
                console.log(otp, expiry, "otp, expiry");
                return [4 /*yield*/, models_1.Customer.create({ email: email, phone: phone, password: userPassword, otp: otp, otp_expiry: expiry, salt: salt })];
            case 6:
                customer = _b.sent();
                if (!customer) return [3 /*break*/, 9];
                //genrate otp and send
                return [4 /*yield*/, (0, utility_1.onOTPRequest)(otp, phone)];
            case 7:
                //genrate otp and send
                _b.sent();
                return [4 /*yield*/, (0, utility_1.GeneratedSignature)({
                        _id: customer._id,
                        email: email,
                        phone: phone,
                        verified: false,
                    })];
            case 8:
                token = _b.sent();
                //send the result to the client
                return [2 /*return*/, res.json({ token: token, email: customer.email, phone: customer.phone })];
            case 9: return [2 /*return*/, res.status(400).json({ message: "Error occurred while creating user account." })];
        }
    });
}); };
exports.CustomerSignUp = CustomerSignUp;
var CustomerLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var loginInputs, loginErrors, email, password, customer, validation, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loginInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.UserLoginInputs, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(loginInputs, { validationError: { target: false } })];
            case 1:
                loginErrors = _a.sent();
                if (loginErrors.length) {
                    return [2 /*return*/, res.status(400).json(loginErrors)];
                }
                email = loginInputs.email, password = loginInputs.password;
                return [4 /*yield*/, models_1.Customer.findOne({ email: email })];
            case 2:
                customer = _a.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(400).json({ message: "invalid login details" })];
                }
                return [4 /*yield*/, (0, utility_1.Validatepassword)(password, customer.password, customer.salt)];
            case 3:
                validation = _a.sent();
                if (!validation) {
                    return [2 /*return*/, res.status(400).json({ message: "invalid login details" })];
                }
                return [4 /*yield*/, (0, utility_1.GeneratedSignature)({
                        _id: customer._id,
                        email: customer.email,
                        verified: customer.verified,
                        phone: customer.phone,
                    })];
            case 4:
                token = _a.sent();
                console.log("token ", token, "token");
                return [2 /*return*/, res.status(200).json({ token: token, verfied: customer.verified, email: customer.email })];
        }
    });
}); };
exports.CustomerLogin = CustomerLogin;
var CustomerVerify = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, otp, profile, otp_expiry, profile_otp, updatedProfile, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                otp = req.body.otp;
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ message: "user not found" })];
                }
                return [4 /*yield*/, models_1.Customer.findById(user._id)];
            case 1:
                profile = _a.sent();
                if (!profile) {
                    return [2 /*return*/, res.status(400).json({ message: "user not found" })];
                }
                otp_expiry = profile.otp_expiry, profile_otp = profile.otp;
                console.log(otp, "otp");
                console.log(profile_otp, "profile_otp");
                console.log(parseInt(otp) === profile_otp);
                if (!(parseInt(otp) === profile_otp && new Date() <= otp_expiry)) return [3 /*break*/, 4];
                profile.verified = true;
                return [4 /*yield*/, profile.save()];
            case 2:
                updatedProfile = _a.sent();
                return [4 /*yield*/, (0, utility_1.GeneratedSignature)({
                        _id: user._id,
                        email: user.email,
                        phone: user.phone,
                        verified: true,
                    })];
            case 3:
                token = _a.sent();
                return [2 /*return*/, res.status(200).json({ token: token, email: updatedProfile.email, phone: updatedProfile.phone, verified: updatedProfile.verified })];
            case 4: return [2 /*return*/, res.status(400).json({ message: "Invalid Otp credentials." })];
        }
    });
}); };
exports.CustomerVerify = CustomerVerify;
var RequestOtp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, phone, profile, _a, otp, expiry, updated_profile;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                phone = user.phone;
                return [4 /*yield*/, models_1.Customer.findById(user._id)];
            case 1:
                profile = _b.sent();
                if (!profile) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid user credentials." })];
                }
                _a = (0, utility_1.GenerateOtp)(), otp = _a.otp, expiry = _a.expiry;
                profile.otp_expiry = expiry;
                profile.otp = otp;
                return [4 /*yield*/, profile.save()];
            case 2:
                updated_profile = _b.sent();
                (0, utility_1.onOTPRequest)(otp, profile.phone);
                return [2 /*return*/, res.status(200).json({ message: "OTP sent successfully." })];
        }
    });
}); };
exports.RequestOtp = RequestOtp;
var GetCustomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                return [4 /*yield*/, models_1.Customer.findById(user === null || user === void 0 ? void 0 : user._id)];
            case 1:
                profile = _a.sent();
                if (!profile) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid user credentials." })];
                }
                return [2 /*return*/, res.status(200).json(profile)];
        }
    });
}); };
exports.GetCustomerProfile = GetCustomerProfile;
var EditCustomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var updates, user, profile, existingVendor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                updates = req.body;
                user = req.user;
                return [4 /*yield*/, models_1.Customer.findById(user === null || user === void 0 ? void 0 : user._id)];
            case 1:
                profile = _a.sent();
                if (!profile) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid user credentials." })];
                }
                Object.assign(profile, updates);
                return [4 /*yield*/, profile.save()];
            case 2:
                existingVendor = _a.sent();
                console.log(existingVendor, "existingVendor");
                return [2 /*return*/, res.status(200).json(existingVendor)];
        }
    });
}); };
exports.EditCustomerProfile = EditCustomerProfile;
//# sourceMappingURL=UserController.js.map