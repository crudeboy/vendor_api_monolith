import { Request, Response } from "express";
import { FindVendor } from ".";
import { EditVendorInputs, VendorLoginInput } from "../dto";
import { CreateFoodInput } from "../dto/Food.dto";
import { Vendor } from "../models";
import { Food } from "../models/Food";
import { GeneratedSignature, Validatepassword } from "../utility";

export const VendorLogin = async (req: Request, res: Response) => {
	const { email, password } = <VendorLoginInput>req.body;
	const existingVendor = await FindVendor("", email);

	if (!existingVendor) {
		return res.json({ message: "Invalid vendor information." });
	}
	//validation and give access
	const isValid = await Validatepassword(password, existingVendor.password, existingVendor.salt);
	if (!isValid) {
		return res.json({ message: "Invalid vendor information." });
	}

	const signature = {
		_id: existingVendor._id,
		email: existingVendor.email,
		phone: existingVendor.phone,
		name: existingVendor.name,
		foodTypes: existingVendor.foodType,
	};
	const signPayload = await GeneratedSignature(signature);

	return res.json({token: signPayload});
};

export const GetVendorProfile = async (req: Request, res: Response) => {
	const user = req.user;
	if (user) {
		const existingVendor = await FindVendor(user._id);

		console.log(existingVendor, "existingVendor");
		return res.json(existingVendor);
	}
	return res.json({ message: "Vendor Information not found." });
};

export const UpdateVendorProfile = async (req: Request, res: Response) => {
	const upates = <EditVendorInputs>req.body;
	const user = req.user;
	if (user) {
		const vendor = await FindVendor(user._id);
		if (vendor) {
			Object.assign(vendor, upates);
			const existingVendor = await vendor.save();
			console.log(existingVendor, "existingVendor");
			return res.json(existingVendor);
		}
	}
	return res.json({ message: "Vendor Information not found." });
};

export const UpdateVendorCoverImage = async (req: Request, res: Response) => {
	const user = req.user;
	if (user) {
		const files = req.files as [Express.Multer.File];
		const imagesNames = files.map((file) => file.filename);

		const vendor = await FindVendor(user._id);
		if (!vendor) {
			return res.json({ message: "Vendor Information not found." });
		}

		vendor.coverImage.push(...imagesNames);
		const result = await vendor.save();
		return res.json(result);
	}

	return res.json({ message: "Food Information not found." });
};

export const UpdateVendorServiceAvailability = async (req: Request, res: Response) => {
	const user = req.user;
	if (user) {
		const vendor = await FindVendor(user._id);
		if (vendor) {
			vendor.serviceAvailable = !vendor.serviceAvailable;
			const existingVendor = await vendor.save();
			console.log(existingVendor, "existingVendor");
			return res.json(existingVendor);
		}
	}
	return res.json({ message: "Vendor Information not found." });
};

export const AddFood = async (req: Request, res: Response) => {
	const user = req.user;
	if (user) {
		const { name, description, category, foodType, readyTime, price } = <CreateFoodInput>req.body;
		const vendor = await FindVendor(user._id);
		if (!vendor) {
			return res.json({ message: "Vendor Information not found." });
		}
		const files = req.files as [Express.Multer.File];

		const imagesNames = files.map((file) => file.filename);

		const foodCreated = await Food.create({ vendorId: vendor._id, name, foodType, description, category, readyTime, price, rating: 0, images: imagesNames });
		vendor.foods.push(foodCreated);
		const result = await vendor.save();
		return res.json(result);
	}

	return res.json({ message: "Food Information not found." });
};

export const GetFood = async (req: Request, res: Response) => {
	const user = req.user;
	if (user) {
		const vendorFoods = await Food.find({ vendorId: user._id });
		return res.json(vendorFoods);
	}
	return res.json({ message: "User Information not found." });
};
