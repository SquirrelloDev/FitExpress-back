import express from "express";
import {
    createOrder, deleteOrder,
    getAllOrders,
    getOrderById,
    getOrdersByDiet,
    getUserOrders, updateActiveStatus, updateOrder
} from "../controllers/ordersController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();
router.get('/', isAuth, getAllOrders);
router.get('/user', isAuth, getUserOrders);
router.get('/diet', isAuth, getOrdersByDiet);
router.get('/:id', isAuth, getOrderById);
router.post('/', isAuth, createOrder);
router.put('/:id', isAuth, updateOrder);
router.patch('/:id', isAuth, updateActiveStatus);
router.delete('/:id', isAuth, deleteOrder)
export {router as ordersRouter}