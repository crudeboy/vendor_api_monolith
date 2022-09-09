import { Request, Response, NextFunction, json } from "express";
import { CreateCustomerInputs, CustomerPayload, EditCustomerInputs, OrderInputs, UserLoginInputs } from "../dto/Customer.dto";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { Customer, Food } from "../models";
import { GenerateSalt, GeneratePassword, GenerateOtp, onOTPRequest, GeneratedSignature, Validatepassword } from "../utility";
import { AuthPayload } from "../dto/Auth.dto";
import { EditVendorInputs } from "../dto";
import { Order } from "../models/Order";

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

export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {
	try {
		//grab the current user login details
		const user = req.user;
		//create the order id
		const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
		const profile = await Customer.findById(user._id);

		const cart = <[OrderInputs]>req.body;
		let cartItems = [];
		let netAmount = 0.0;
		//grab order items from request [{id: xx, unit: xx}]
		//calculate order amount
		const foods = await Food.find()
			.where("_id")
			.in(cart.map((item) => item._id))
			.exec();
		console.log(foods, "foods");

		foods.map((food) => {
			cart.map(({ _id, unit }) => {
				console.log(food._id, "food._id", _id, "_id");
				if (food._id == _id) {
					console.log("i entered here aw far");
					netAmount += food.price * unit;
					cartItems.push({ food, unit });
				}
			});
		});
		console.log(cartItems, "cartItems");
		// return res.status(200).json("updatedProfile");
		// //create order with item description
		const order = await Order.create({
			orderId,
			items: cartItems,
			totalAmount: netAmount,
			orderDate: Date.now(),
			paidThrough: "cash", //cash, Credit card, wallet
			paymentResponse: "working on it",
			orderStatus: "waiting",
		});

		console.log(order, "order");
		if (order) {
			profile.orders.push(order);
			await profile.save();
			return res.status(200).json(order);
		}

		//update orders to user account
	} catch (error) {
		console.log(error, "error");
	}
};

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
	const customer = req.user;

	if (customer) {
		const profile = await Customer.findById(customer._id).populate("orders");
		if (profile) {
			return res.status(200).json(profile.orders);
		}
	}

	return res.status(400).json({ msg: "Orders not found" });
};

export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user
	const orderId = req.params.id;
	console.log(orderId, "orderId")
	if (orderId) {
		const order = await Order.findById(orderId).populate("items.food");

		if (order) {
			return res.status(200).json(order);
		}
	}

	return res.status(400).json({ msg: "Order not found" });
};
