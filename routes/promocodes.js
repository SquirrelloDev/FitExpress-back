import express from "express";
import {
    assignPromoToUser,
    createPromocode,
    deletePromocode,
    getPromocodeByName,
    getPromocodes,
    updatePromoData
} from "../controllers/promocodesController.js";

const router = express.Router()
router.get('/', getPromocodes)
router.get('/:name', getPromocodeByName)
router.post('/new', createPromocode)
router.put('/:id', updatePromoData)
router.put('/', assignPromoToUser)
router.delete('/:id', deletePromocode)
export {router as promocodesRouter}