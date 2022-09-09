import express, { Request, Response, NextFunction } from "express";
import { CustomerSignUp, CustomerLogin, CustomerVerify, RequestOtp, GetCustomerProfile, EditCustomerProfile, CreateOrder, GetOrderById, GetOrders } from "../controllers/UserController";
import { Authenticate } from "../middlewares";

const router = express.Router();

// sign up / create customer
router.post('/signup', CustomerSignUp)

// login
router.post('/login', CustomerLogin)

router.use(Authenticate)
// verify custoimer account
router.post('/verify', CustomerVerify)

//OTP / request OTP
router.get('/otp', RequestOtp)

//Profile
router.get('/profile', GetCustomerProfile)

router.patch('/profile', EditCustomerProfile)
//cart
//order
//payment

//Order
router.post('/create-order', CreateOrder);
router.get('/orders', GetOrders);
router.get('/order/:id', GetOrderById)

export { router as UserRoute };
