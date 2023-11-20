import express from "express";
import {
    addPoint,
    deletePoint,
    getAllPoints, getPointByCoords,
    getPointById,
    updatePoint
} from "../controllers/deliveryPointsController.js";
const router = express.Router()

router.get('/', getAllPoints);
router.get('/search', getPointByCoords)
router.get('/:id', getPointById);
router.post('/', addPoint);
router.put('/:id', updatePoint);
router.delete('/:id', deletePoint);
export {router as deliveryRouter}