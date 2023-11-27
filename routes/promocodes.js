import express from "express";
import {
    assignPromoToUser,
    createPromocode,
    deletePromocode,
    getPromocodeByName,
    getPromocodes,
    updatePromoData
} from "../controllers/promocodesController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router()
router.get('/', isAuth, getPromocodes)
router.get('/:name', isAuth, getPromocodeByName)
router.post('/new', isAuth, createPromocode)
router.put('/:id', isAuth, updatePromoData)
router.put('/', isAuth, assignPromoToUser)
router.delete('/:id', isAuth, deletePromocode)
export {router as promocodesRouter}