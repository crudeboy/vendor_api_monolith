import express, { Request, Response, NextFunction } from "express";
import bodyparser from "body-parser";
import { AdminRoute, VendorRoute } from "./routes";
import mongoose from "mongoose";
import { MONGO_URI } from "./config";
import cron from "node-cron";
import { Vendor } from "./models";
import path from 'path'

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use("/admin", AdminRoute);
app.use("/vendor", VendorRoute);

app.get("/", (req: Request, res: Response) => {
	console.log("i am");
	res.json({ message: "Food API, loading ding din din din" });
});

// router.get("/", (req: Request, res: Response, next: NextFunction) => {
// 	res.json({ message: "Hello from Admin" });
// });

//connect mingo db
mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then((result) => {
		console.log("Database connectd");
	})
	.catch((err) => {
		console.log("error", err);
	});

//schedule job to keep the mongo instance alive
// schedule tasks to be run on the server
cron.schedule("0 */6 * * *", async function () {
	await Vendor.count()
	console.log("Running a task every minute");
	console.log("Email successfully sent by cron!");
});

app.listen(3005, () => {
	console.clear();
	console.log("App is listening on port 3005");
});
