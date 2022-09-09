import mongoose, { Schema, Document, Model } from "mongoose";

interface FoodDoc extends Document {
	vendorId: string;
	name: string;
	description: string;
	foodType: string;
	category: string;
	readyTime: string;
	price: number;
	rating: number;
	images: [string];
}

const FoodSchema = new Schema(
	{
		vendorId: { type: String, required: true },
		name: { type: String, required: true, unique: true },
		category: { type: String, required: true },
		foodType: { type: String, required: true },
		readyTime: { type: String, required: true },
		price: { type: String, required: true },
		rating: { type: String, required: true },
		images: { type: [String] },
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

export const Food = mongoose.model<FoodDoc>("food", FoodSchema);
