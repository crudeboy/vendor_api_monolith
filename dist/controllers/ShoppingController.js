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
exports.GetResturantById = exports.SearchFoods = exports.GetFoodIn30Mins = exports.GetTopResturants = exports.GetFooodAvailability = void 0;
var models_1 = require("../models");
var GetFooodAvailability = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var pincode, allFoods;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pincode = req.params.pincode;
                console.log(pincode, "pincode");
                return [4 /*yield*/, models_1.Vendor.find({ pincode: pincode, serviceAvailable: false })
                        .sort([["rating", "descending"]])
                        .populate("foods")];
            case 1:
                allFoods = _a.sent();
                if (allFoods.length) {
                    return [2 /*return*/, res.status(200).json(allFoods)];
                }
                return [2 /*return*/, res.status(400).json({ message: "No food available at this moment." })];
        }
    });
}); };
exports.GetFooodAvailability = GetFooodAvailability;
var GetTopResturants = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var pincode, topResturant;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pincode = req.params.pincode;
                console.log(pincode, "pincode");
                return [4 /*yield*/, models_1.Vendor.find({ pincode: pincode, serviceAvailable: false })
                        .sort([["rating", "descending"]])
                        .limit(1)];
            case 1:
                topResturant = _a.sent();
                console.log(topResturant, "topResturant");
                if (topResturant) {
                    return [2 /*return*/, res.status(200).json(topResturant)];
                }
                return [2 /*return*/, res.status(400).json({ message: "Resturant not found." })];
        }
    });
}); };
exports.GetTopResturants = GetTopResturants;
var GetFoodIn30Mins = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var pincode, foodsAvailableIn30;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pincode = req.params.pincode;
                console.log(pincode, "pincode");
                return [4 /*yield*/, models_1.Vendor.find({ pincode: pincode, serviceAvailable: false })
                        .where("foods")
                        .ne([])
                        .sort([["rating", "descending"]])
                        .populate({
                        path: "foods",
                        match: { readyTime: { $lte: 30 } },
                    })
                        .exec()];
            case 1:
                foodsAvailableIn30 = _a.sent();
                console.log(foodsAvailableIn30, "foodsAvailableIn30");
                if (foodsAvailableIn30.length) {
                    return [2 /*return*/, res.status(200).json(foodsAvailableIn30)];
                }
                return [2 /*return*/, res.status(400).json({ message: "Foods not found." })];
        }
    });
}); };
exports.GetFoodIn30Mins = GetFoodIn30Mins;
var SearchFoods = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var pincode, allFoods;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pincode = req.params.pincode;
                console.log(pincode, "pincode");
                return [4 /*yield*/, models_1.Vendor.find({ pincode: pincode, serviceAvailable: false }).select("foods").populate("foods")];
            case 1:
                allFoods = _a.sent();
                if (allFoods.length) {
                    return [2 /*return*/, res.status(200).json(allFoods)];
                }
                return [2 /*return*/, res.status(400).json({ message: "No food available at this moment." })];
        }
    });
}); };
exports.SearchFoods = SearchFoods;
var GetResturantById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, models_1.Vendor.findById(id).populate("foods")];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, res.status(200).json(result)];
                }
                return [2 /*return*/, res.status(400).json({ message: "Resturant not found." })];
        }
    });
}); };
exports.GetResturantById = GetResturantById;
//# sourceMappingURL=ShoppingController.js.map