import { Request, Response, NextFunction, json } from "express";
import { CreateCustomerInputs, CustomerPayload, EditCustomerInputs, UserLoginInputs } from "../dto/Customer.dto";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { Customer } from "../models";
import { GenerateSalt, GeneratePassword, GenerateOtp, onOTPRequest, GeneratedSignature, Validatepassword } from "../utility";
import { AuthPayload } from "../dto/Auth.dto";
import { EditVendorInputs } from "../dto";

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
	const customerInputs = plainToClass(CreateCustomerInputs, req.body);

	const InputErrors = await validate(customerInputs, { validationError: { target: true } });

	if (InputErrors.length) {
		return res.status(400).json(InputErrors);
	}

	const { email, phone, password } = customerInputs;

	//checks
	const existingEmail = await Customer.findOne({ email });
	if (existingEmail) {
		return res.status(409).json({ message: "A User exists with provided email." });
	}
	const existingPhone = await Customer.findOne({ phone });
	if (existingPhone) {
		return res.status(409).json({ message: "A User exists with provided phone." });
	}

	//generate salt and hash password
	const salt = await GenerateSalt();
	const userPassword = await GeneratePassword(password, salt);
	const { otp, expiry } = GenerateOtp();
	console.log(otp, expiry, "otp, expiry");

	const customer = await Customer.create({ email, phone, password: userPassword, otp, otp_expiry: expiry, salt });
	if (customer) {
		//genrate otp and send
		await onOTPRequest(otp, phone);
		//generate the token
		const token = await GeneratedSignature({
			_id: customer._id,
			email,
			phone,
			verified: false,
		});

		//send the result to the client
		return res.json({ token, email: customer.email, phone: customer.phone });
	}

	return res.status(400).json({ message: "Error occurred while creating user account." });
};

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
	const loginInputs = plainToClass(UserLoginInputs, req.body);

	const loginErrors = await validate(loginInputs, { validationError: { target: false } });

	if (loginErrors.length) {
		return res.status(400).json(loginErrors);
	}

	const { email, password } = loginInputs;
	const customer = await Customer.findOne({ email });

	if (!customer) {
		return res.status(400).json({ message: "invalid login details" });
	}

	const validation = await Validatepassword(password, customer.password, customer.salt);
	if (!validation) {
		return res.status(400).json({ message: "invalid login details" });
	}

	const token = await GeneratedSignature({
		_id: customer._id,
		email: customer.email,
		verified: customer.verified,
		phone: customer.phone,
	});
	console.log("token ", token, "token");

	return res.status(200).json({ token, verfied: customer.verified, email: customer.email });
};

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {
	const user = <CustomerPayload>req.user;
	const { otp } = req.body;
	if (!user) {
		return res.status(400).json({ message: "user not found" });
	}
	const profile = await Customer.findById(user._id);
	if (!profile) {
		return res.status(400).json({ message: "user not found" });
	}

	const { otp_expiry, otp: profile_otp } = profile;
	console.log(otp, "otp");
	console.log(profile_otp, "profile_otp");
	console.log(parseInt(otp) === profile_otp);
	if (parseInt(otp) === profile_otp && new Date() <= otp_expiry) {
		profile.verified = true;
		const updatedProfile = await profile.save();
		const token = await GeneratedSignature({
			_id: user._id,
			email: user.email,
			phone: user.phone,
			verified: true,
		});

		return res.status(200).json({ token, email: updatedProfile.email, phone: updatedProfile.phone, verified: updatedProfile.verified });
	}

	return res.status(400).json({ message: "Invalid Otp credentials." });
};

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {
	const user = <AuthPayload>req.user;

	const { phone } = user;
	const profile = await Customer.findById(user._id);
	if (!profile) {
		return res.status(400).json({ message: "Invalid user credentials." });
	}

	const { otp, expiry } = GenerateOtp();
	profile.otp_expiry = expiry;
	profile.otp = otp;
	const updated_profile = await profile.save();

	onOTPRequest(otp, profile.phone);
	return res.status(200).json({ message: "OTP sent successfully." });
};

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const profile = await Customer.findById(user?._id);

	if (!profile) {
		return res.status(400).json({ message: "Invalid user credentials." });
	}
	return res.status(200).json(profile);
};

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
	const updates = <EditCustomerInputs>req.body;
	const user = req.user;
	const profile = await Customer.findById(user?._id);

	if (!profile) {
		return res.status(400).json({ message: "Invalid user credentials." });
	}

	Object.assign(profile, updates);
	const existingVendor = await profile.save();
	console.log(existingVendor, "existingVendor");
	return res.status(200).json(existingVendor);
};
