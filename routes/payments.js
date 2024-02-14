import {Router} from "express";
import {Stripe} from "stripe";
import {processPayment} from "../controllers/paymentController.js";

const router = Router();
router.post('/create-checkout-session', processPayment)
export {router as paymentsRouter}