import express, { Request, Response, NextFunction } from "express";
import { CreateQuote, DeleteQuote, GetAllQuotes, GetQuote, updateQuote } from "../controllers/QuoteCOntroller";
import { Authenticate } from "../middlewares";

const router = express.Router();

// 1. Fetching all existing quotes
// 2. Fetching a specific existing quote
// 3. Creation of a new quote
// 4. Updating of an existing quote
// 5. Deletion of an existing quote
// sign up / create customer
router.use(Authenticate)
router.get('/quotes', )

// login
router.get('/:id', GetQuote)
router.get('/', GetAllQuotes)

router.post('/create', CreateQuote)

router.patch('/:id', updateQuote)

router.delete('/:id', DeleteQuote)

export { router as QuoteRoute };