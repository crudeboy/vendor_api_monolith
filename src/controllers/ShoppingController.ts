import express, { Request, Response, NextFunction } from "express";
import { LocalPage } from "twilio/lib/rest/api/v2010/account/availablePhoneNumber/local";
import { Vendor } from "../models";

export const GetFooodAvailability = async (req: Request, res: Response, next: NextFunction) => {
	const pincode = req.params.pincode;
	console.log(pincode, "pincode");

	const allFoods = await Vendor.find({ pincode, serviceAvailable: false })
		.sort([["rating", "descending"]])
		.populate("foods");

	if (allFoods.length) {
		return res.status(200).json(allFoods);
	}

	return res.status(400).json({ message: "No food available at this moment." });
};

export const GetTopResturants = async (req: Request, res: Response, next: NextFunction) => {
	const pincode = req.params.pincode;
	console.log(pincode, "pincode");

	const topResturant = await Vendor.find({ pincode, serviceAvailable: false })
		.sort([["rating", "descending"]])
		.limit(1);
	console.log(topResturant, "topResturant");
	if (topResturant) {
		return res.status(200).json(topResturant);
	}

	return res.status(400).json({ message: "Resturant not found." });
};

export const GetFoodIn30Mins = async (req: Request, res: Response, next: NextFunction) => {
	const pincode = req.params.pincode;
	console.log(pincode, "pincode");

	const foodsAvailableIn30 = await Vendor.find({ pincode, serviceAvailable: false })
		.where("foods")
		.ne([])
		.sort([["rating", "descending"]])
		.populate({
			path: "foods",
			match: { readyTime: { $lte: 30 } },
		})
		.exec();
	console.log(foodsAvailableIn30, "foodsAvailableIn30");
	if (foodsAvailableIn30.length) {
		return res.status(200).json(foodsAvailableIn30);
	}

	return res.status(400).json({ message: "Foods not found." });
};

export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {
	const pincode = req.params.pincode;
	console.log(pincode, "pincode");

	const allFoods = await Vendor.find({ pincode, serviceAvailable: false }).select("foods").populate("foods");

	if (allFoods.length) {
		return res.status(200).json(allFoods);
	}

	return res.status(400).json({ message: "No food available at this moment." });
};

export const GetResturantById = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;

	const result = await Vendor.findById(id).populate("foods");
	if(result){
		return res.status(200).json(result);
	}

	return res.status(400).json({ message: "Resturant not found." });
};
