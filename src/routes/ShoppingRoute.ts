import express, { Request, Response, NextFunction } from "express";
import { GetFooodAvailability, GetTopResturants, GetFoodIn30Mins, SearchFoods, GetResturantById } from "../controllers/ShoppingController";

const router = express.Router();

//food availability
router.get('/:pincode', GetFooodAvailability)

//top resturants
router.get('/top-resturants/:pincode', GetTopResturants)

//food available in 30 mins
router.get('/foods-in-30-mins/:pincode', GetFoodIn30Mins)

//search foods
router.get('/search/:pincode', SearchFoods)

//find resturant by id
router.get('/resturant/:id', GetResturantById)


export { router as ShoppingRoute };