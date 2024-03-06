import isAuth from "../middleware/isAuth.js";
import express from "express";
import {addSubscription, notifyAll, removeSubscription} from "../controllers/webpushController.js";
const router = express.Router();
router.post('/create', isAuth, addSubscription);
router.post('/remove', isAuth, removeSubscription);
router.post('/notify', notifyAll);
export {router as webpushRouter}