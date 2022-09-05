import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import { AddFood, GetFood, GetVendorProfile, UpdateVendorCoverImage, UpdateVendorProfile, UpdateVendorServiceAvailability, VendorLogin } from "../controllers/VendorController";
import { Authenticate } from "../middlewares";

const router = express.Router();

const imageStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "images");
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString() + "_" + file.originalname);
	},
});

const images = multer({ storage: imageStorage }).array("images", 10);

router.post("/login", VendorLogin);
router.use(Authenticate);
router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);
router.patch("/coverImage", images, UpdateVendorCoverImage);
router.patch("/serviceAvailability", UpdateVendorServiceAvailability);
router.post("/food", images, AddFood);
router.get("/food", GetFood);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
	res.json({ message: "Hello from vendor" });
});

export { router as VendorRoute };
