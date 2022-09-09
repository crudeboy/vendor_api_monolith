"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
var express_1 = __importDefault(require("express"));
var ShoppingController_1 = require("../controllers/ShoppingController");
var router = express_1.default.Router();
exports.ShoppingRoute = router;
//food availability
router.get('/:pincode', ShoppingController_1.GetFooodAvailability);
//top resturants
router.get('/top-resturants/:pincode', ShoppingController_1.GetTopResturants);
//food available in 30 mins
router.get('/foods-in-30-mins/:pincode', ShoppingController_1.GetFoodIn30Mins);
//search foods
router.get('/search/:pincode', ShoppingController_1.SearchFoods);
//find resturant by id
router.get('/resturant/:id', ShoppingController_1.GetResturantById);
//# sourceMappingURL=ShoppingRoute.js.map