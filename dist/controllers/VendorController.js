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
exports.GetFood = exports.AddFood = exports.UpdateVendorServiceAvailability = exports.UpdateVendorCoverImage = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
var _1 = require(".");
var Food_1 = require("../models/Food");
var utility_1 = require("../utility");
var VendorLogin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, existingVendor, isValid, signature, signPayload;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, (0, _1.FindVendor)("", email)];
            case 1:
                existingVendor = _b.sent();
                if (!existingVendor) {
                    return [2 /*return*/, res.json({ message: "Invalid vendor information." })];
                }
                return [4 /*yield*/, (0, utility_1.Validatepassword)(password, existingVendor.password, existingVendor.salt)];
            case 2:
                isValid = _b.sent();
                if (!isValid) {
                    return [2 /*return*/, res.json({ message: "Invalid vendor information." })];
                }
                signature = {
                    _id: existingVendor._id,
                    email: existingVendor.email,
                    phone: existingVendor.phone,
                    name: existingVendor.name,
                    foodTypes: existingVendor.foodType,
                };
                return [4 /*yield*/, (0, utility_1.GeneratedSignature)(signature)];
            case 3:
                signPayload = _b.sent();
                return [2 /*return*/, res.json({ token: signPayload })];
        }
    });
}); };
exports.VendorLogin = VendorLogin;
var GetVendorProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, existingVendor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, _1.FindVendor)(user._id)];
            case 1:
                existingVendor = _a.sent();
                console.log(existingVendor, "existingVendor");
                return [2 /*return*/, res.json(existingVendor)];
            case 2: return [2 /*return*/, res.json({ message: "Vendor Information not found." })];
        }
    });
}); };
exports.GetVendorProfile = GetVendorProfile;
var UpdateVendorProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var upates, user, vendor, existingVendor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                upates = req.body;
                user = req.user;
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, _1.FindVendor)(user._id)];
            case 1:
                vendor = _a.sent();
                if (!vendor) return [3 /*break*/, 3];
                Object.assign(vendor, upates);
                return [4 /*yield*/, vendor.save()];
            case 2:
                existingVendor = _a.sent();
                console.log(existingVendor, "existingVendor");
                return [2 /*return*/, res.json(existingVendor)];
            case 3: return [2 /*return*/, res.json({ message: "Vendor Information not found." })];
        }
    });
}); };
exports.UpdateVendorProfile = UpdateVendorProfile;
var UpdateVendorCoverImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, files, imagesNames, vendor, result;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 3];
                files = req.files;
                imagesNames = files.map(function (file) { return file.filename; });
                return [4 /*yield*/, (0, _1.FindVendor)(user._id)];
            case 1:
                vendor = _b.sent();
                if (!vendor) {
                    return [2 /*return*/, res.json({ message: "Vendor Information not found." })];
                }
                (_a = vendor.coverImage).push.apply(_a, imagesNames);
                return [4 /*yield*/, vendor.save()];
            case 2:
                result = _b.sent();
                return [2 /*return*/, res.json(result)];
            case 3: return [2 /*return*/, res.json({ message: "Food Information not found." })];
        }
    });
}); };
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
var UpdateVendorServiceAvailability = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, vendor, existingVendor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, _1.FindVendor)(user._id)];
            case 1:
                vendor = _a.sent();
                if (!vendor) return [3 /*break*/, 3];
                vendor.serviceAvailable = !vendor.serviceAvailable;
                return [4 /*yield*/, vendor.save()];
            case 2:
                existingVendor = _a.sent();
                console.log(existingVendor, "existingVendor");
                return [2 /*return*/, res.json(existingVendor)];
            case 3: return [2 /*return*/, res.json({ message: "Vendor Information not found." })];
        }
    });
}); };
exports.UpdateVendorServiceAvailability = UpdateVendorServiceAvailability;
var AddFood = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, name_1, description, category, foodType, readyTime, price, vendor, files, imagesNames, foodCreated, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 4];
                _a = req.body, name_1 = _a.name, description = _a.description, category = _a.category, foodType = _a.foodType, readyTime = _a.readyTime, price = _a.price;
                return [4 /*yield*/, (0, _1.FindVendor)(user._id)];
            case 1:
                vendor = _b.sent();
                if (!vendor) {
                    return [2 /*return*/, res.json({ message: "Vendor Information not found." })];
                }
                files = req.files;
                imagesNames = files.map(function (file) { return file.filename; });
                return [4 /*yield*/, Food_1.Food.create({ vendorId: vendor._id, name: name_1, foodType: foodType, description: description, category: category, readyTime: readyTime, price: price, rating: 0, images: imagesNames })];
            case 2:
                foodCreated = _b.sent();
                vendor.foods.push(foodCreated);
                return [4 /*yield*/, vendor.save()];
            case 3:
                result = _b.sent();
                return [2 /*return*/, res.json(result)];
            case 4: return [2 /*return*/, res.json({ message: "Food Information not found." })];
        }
    });
}); };
exports.AddFood = AddFood;
var GetFood = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, vendorFoods;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 2];
                return [4 /*yield*/, Food_1.Food.find({ vendorId: user._id })];
            case 1:
                vendorFoods = _a.sent();
                return [2 /*return*/, res.json(vendorFoods)];
            case 2: return [2 /*return*/, res.json({ message: "User Information not found." })];
        }
    });
}); };
exports.GetFood = GetFood;
//# sourceMappingURL=VendorController.js.map