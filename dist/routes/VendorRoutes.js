"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
var express_1 = __importDefault(require("express"));
var multer_1 = __importDefault(require("multer"));
var VendorController_1 = require("../controllers/VendorController");
var middlewares_1 = require("../middlewares");
var router = express_1.default.Router();
exports.VendorRoute = router;
var imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "_" + file.originalname);
    },
});
var images = (0, multer_1.default)({ storage: imageStorage }).array("images", 10);
router.post("/login", VendorController_1.VendorLogin);
router.use(middlewares_1.Authenticate);
router.get("/profile", VendorController_1.GetVendorProfile);
router.patch("/profile", VendorController_1.UpdateVendorProfile);
router.patch("/coverImage", images, VendorController_1.UpdateVendorCoverImage);
router.patch("/serviceAvailability", VendorController_1.UpdateVendorServiceAvailability);
router.post("/food", images, VendorController_1.AddFood);
router.get("/food", VendorController_1.GetFood);
router.get("/", function (req, res, next) {
    res.json({ message: "Hello from vendor" });
});
//# sourceMappingURL=VendorRoutes.js.map