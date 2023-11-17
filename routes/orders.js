import express from "express";
import {
    createOrder, deleteOrder,
    getAllOrders,
    getOrderById,
    getOrdersByDiet,
    getUserOrders, updateOrder
} from "../controllers/ordersController.js";

const router = express.Router();
router.get('/', getAllOrders);
router.get('/user', getUserOrders);
router.get('/diet', getOrdersByDiet);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder)
export {router as ordersRouter}