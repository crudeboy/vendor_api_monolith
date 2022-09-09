import mongoose, { Schema, Document, Model } from "mongoose";
import { GenerateSalt } from "../utility";

interface QuoteDoc extends Document {
	quote: string;
    author: string;
}

const QuoteSchema = new Schema(
	{
		quote: { type: String, required: true },
		author: { type: String, required: true }
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

export const Quote = mongoose.model<QuoteDoc>("quote", QuoteSchema);