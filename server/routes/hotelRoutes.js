import express from 'express';
const hotelRouter = express.Router();
import { registerHotel, getAllHotels } from "../controllers/hotelController.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

hotelRouter.get('/', getAllHotels);
hotelRouter.post('/', protectedRoute, registerHotel);

export default hotelRouter;
