import mongoose, { Schema, Document, Model } from "mongoose";

export interface OrderDoc extends Document {
	orderId: string;
	items: [any];
	totalAmount: number;
	orderDate: Date;
	paidThrough: string; //cash, Credit card, wallet
	paymentResponse: string;
	orderStatus: string;
}

const OrderSchema = new Schema(
	{
		orderId: { type: String, required: true },
		items: [
			{
				food: { type: Schema.Types.ObjectId, ref: "food", required: true },
				unit: { type: Number, required: true },
			},
		],
		totalAmount: { type: Number, required: true },
		orderDate: { type: Date, required: true, default: Date.now() },
		paymentResponse: { type: String, required: true },
		paidThrough: { type: String, enum: ["card", "wallet", "cash"], required: true }, //cash, Credit card, wallet
		orderStatus: { type: String, enum: ["processing", "processed", "waiting"] },
	},
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.__v, delete ret.createdAt, delete ret.updatedAt;
			},
		},
		timestamps: true,
	}
);

export const Order = mongoose.model<OrderDoc>("order", OrderSchema);
