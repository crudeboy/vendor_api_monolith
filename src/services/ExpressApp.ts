import express, { Application, Request, Response, NextFunction } from "express";
import { AdminRoute, ShoppingRoute, UserRoute, VendorRoute } from "../routes";
import path from "path";
import { QuoteRoute } from "../routes/QuotesRoute";

export default async (app: Application) => {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use("/images", express.static(path.join(__dirname, "images")));

	app.use("/admin", AdminRoute);
	app.use("/vendor", VendorRoute);
	app.use("/shopping", ShoppingRoute);
	app.use('/user', UserRoute)
	app.use('/quote', QuoteRoute)

	app.get("/", (req: Request, res: Response) => {
		console.log("i am");
		res.json({ message: "Food API, loading ding din din din" });
	});
	return app;
};
