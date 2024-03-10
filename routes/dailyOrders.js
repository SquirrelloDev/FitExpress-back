import express from "express";
import {addOrderToList, getAllDailyOrders, getDailyOrderByDate} from "../controllers/dailyOrdersController.js";
import isAuth from "../middleware/isAuth.js";
// import {initDay} from "../utils/daysSetup.js";
const router = express.Router();
router.get('/', isAuth, getAllDailyOrders);
// router.post('/', initDay);
router.get('/date', isAuth, getDailyOrderByDate);
router.put('/', isAuth, addOrderToList)
export {router as dailyRouter}