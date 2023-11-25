import express from "express";
import {addOrderToList, getAllDailyOrders, getDailyOrderByDate} from "../controllers/dailyOrdersController.js";
const router = express.Router();
router.get('/', getAllDailyOrders);
// router.post('/', initDay);
router.get('/date', getDailyOrderByDate);
router.put('/', addOrderToList)
export {router as dailyRouter}