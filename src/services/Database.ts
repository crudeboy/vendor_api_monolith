import mongoose from "mongoose";
import { MONGO_URI } from "../config";

export default async () => {
	try {
		console.log("database connecting...");
		//connect mingo db
		mongoose
			.connect(MONGO_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
			})
			.then(() => {
				console.log("Database connectd");
			})
			.catch((err) => {
				console.log(err);
			});
	} catch (error) {
		console.log(error);
	}
};
