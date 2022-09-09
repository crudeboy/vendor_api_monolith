import bcrypt from "bcrypt";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { VendorPayload } from "../dto";
import { AuthPayload } from "../dto/Auth.dto";

export const GenerateSalt = async () => {
	return await bcrypt.genSalt(8);
};

export const GeneratePassword = async (password: string, salt: string) => {
	return await bcrypt.hash(password, salt);
};

export const Validatepassword = async (password: string, savedPassword: string, salt: string) => {
	return (await GeneratePassword(password, salt)) === savedPassword;
};

export const GeneratedSignature = async (payload: AuthPayload) => {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

export const ValidateSignature = async (req: Request) => {
	try {
		const token = req.get("Authorization");
		if (token) {
			const payload = jwt.verify(token.split(" ")[1], JWT_SECRET) as AuthPayload;
			req.user = payload;
			return true;
		}
		return false;
	} catch (error) {
		console.log(error, "*********error********")
	}
};
