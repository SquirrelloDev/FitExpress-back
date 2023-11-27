import express from "express";
import {
    addPoint,
    deletePoint,
    getAllPoints, getPointByCoords,
    getPointById,
    updatePoint
} from "../controllers/deliveryPointsController.js";
import isAuth from "../middleware/isAuth.js";
const router = express.Router()

router.get('/', isAuth, getAllPoints);
router.get('/search', isAuth, getPointByCoords)
router.get('/:id', isAuth, getPointById);
router.post('/', isAuth, addPoint);
router.put('/:id', isAuth, updatePoint);
router.delete('/:id', isAuth, deletePoint);
export {router as deliveryRouter}