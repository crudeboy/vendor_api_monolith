import mongoose, { Schema, Document, Model } from "mongoose";
import { OrderDoc } from "./Order";

interface CustomerDoc extends Document {
	firstName: string;
	lastName: string;
	password: string;
	phone: string;
	email: string;
	salt: string;
	address: string;
	verified: boolean;
	otp: number;
	otp_expiry: Date;
	lat: number;
	lng: number;
	orders: [OrderDoc]
}

const CustomerSchema = new Schema(
	{
		firstName: { type: String, default: "" },
		lastName: { type: String },
		address: { type: String, default: "" },
		phone: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		salt: { type: String, required: true },
		verified: { type: Boolean, default: false },
		otp: { type: Number, required: true },
		otp_expiry: { type: Date, required: true },
		lat: { type: Number, default: 0 },
		lng: { type: Number, default: 0 },
		orders: [{ type: mongoose.SchemaTypes.ObjectId, ref: "order", required: true }],
	},
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.password, delete ret.salt, delete ret.__v, delete ret.createdAt, delete ret.updatedAt;
			},
		},
		timestamps: true,
	}
);

export const Customer = mongoose.model<CustomerDoc>("customer", CustomerSchema);
