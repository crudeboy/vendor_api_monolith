import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const FindVendor = async (id: string | undefined, email?: string) => {
	if (email) {
		return await Vendor.findOne({ email });
	}
	if (id) {
		return await Vendor.findById(id);
	}
};

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
	const { ...vendorDetails } = <CreateVendorInput>req.body;
	console.log(vendorDetails, "vendorDetails");

	//get vendor by emal and phone
	const vendor_by_mail = await FindVendor("", vendorDetails.email);
	const vendor_by_phone = await Vendor.findOne({ phone: vendorDetails.phone });

	if (vendor_by_mail || vendor_by_phone) {
		return res.json({ success: false, message: "email or phone already exists" });
	}

	//generate salt and hash password
	const salt = await GenerateSalt();
	const userPassword = await GeneratePassword(vendorDetails.password, salt);

	const create_vendor = {
		...vendorDetails,
		password: userPassword,
		salt,
		serviceAvailable: false,
		coverImage: "www.google.com",
		rating: 0,
	};
	const vendor = await Vendor.create({
		...vendorDetails,
		password: userPassword,
		salt,
		serviceAvailable: false,
		coverImage: "www.google.com",
		rating: 0,
		// foods: []
	});
	return res.json(vendor);
};

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
	const vendors = await Vendor.find();
	console.log(vendors, "vendors");
	if (!vendors) {
		return res.json({ message: "There are no vendors" });
	}
	return res.json(vendors);
};

export const GetVendorsById = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;
	const vendor = await FindVendor(id);

	if (!vendor) {
		return res.json({ message: "Vendor not found" });
	}
	return res.json(vendor);
};
