import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction, json } from "express";
import { CreateQuoteInputs, UpdateQuotePayload } from "../dto/Quote.dto";
import { Quote } from "../models/Quote";

export const CreateQuote = async (req: Request, res: Response, next: NextFunction) => {
	const quoteInput = plainToClass(CreateQuoteInputs, req.body);

	const InputErrors = await validate(quoteInput, { validationError: { target: true } });

	if (InputErrors.length) {
		return res.status(400).json(InputErrors);
	}

	const quote = await Quote.create({ ...quoteInput });
	return res.status(201).json(quote);
};

export const GetQuote = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const quote = await Quote.findById(id);
	return res.status(200).json(quote);
};

export const GetAllQuotes = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const quotes = await Quote.find();
	return res.status(200).json(quotes);
};

export const updateQuote = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const { quote, author } = req.body;
    console.log(req.body, "req.body")
	if (!quote && !author) {
		return res.status(400).json({ message: "either the author or the quote must be provided" });
	}
	const quoteFromDB = await Quote.findById(id);
    if(quote) quoteFromDB.quote = quote
    if(author) quoteFromDB.author = author
	// Object.assign(quoteFromDB, { quote, author });
	const upatedQuote = await quoteFromDB.save();
    console.log(upatedQuote, "upatedQuote")

	return res.status(200).json(upatedQuote);
};

export const DeleteQuote = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const quote = await Quote.findByIdAndDelete(id);

	return res.status(200).json({ message: "successfully deleted the quote" });
};
