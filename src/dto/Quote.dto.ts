import { IsEmail, IsEmpty, IsNotEmpty, Length } from "class-validator";

export class CreateQuoteInputs {
	@IsNotEmpty()
	quote!: string;

	@IsNotEmpty()
	author!: string;
}

export interface UpdateQuotePayload {
	quote?: string
	author?: string
}