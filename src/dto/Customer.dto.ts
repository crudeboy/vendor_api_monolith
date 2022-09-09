import { IsEmail, IsEmpty, IsNotEmpty, Length } from "class-validator";

export class CreateCustomerInputs {
	@IsNotEmpty()
	@IsEmail()
	email!: string;

	@IsNotEmpty()
	@Length(11)
	phone!: string;

	@IsNotEmpty()
	@Length(8, 12)
	password!: string;
}

export class UserLoginInputs {
    @IsNotEmpty()
	@IsEmail()
	email!: string;

    @IsNotEmpty()
	@Length(8, 12)
	password!: string;
}

export interface CustomerPayload {
	_id: string
	email: string
	phone: string
    verified: boolean
}

export interface EditCustomerInputs {
	firstName?: string
	address?: string
	lastName?: string
	phone?: string;
	email?: string;
}

export interface OrderInputs {
	_id: string
	unit: number
}