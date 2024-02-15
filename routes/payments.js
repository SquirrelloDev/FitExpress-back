import {Router} from "express";
import {Stripe} from "stripe";
import {fulfill, processPayment} from "../controllers/paymentController.js";
import bodyParser from "body-parser";

const router = Router();
router.post('/create-checkout-session', processPayment)
// router.post('/webhook', bodyParser.raw({type: 'application/json'}) ,fulfill)
export {router as paymentsRouter}