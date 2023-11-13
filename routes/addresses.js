import express from "express";
import {
    addAddress,
    deleteAddress,
    getAddressById,
    getAddresses,
    updateAddress
} from "../controllers/addressesController.js";
const router = express.Router()
router.post('/', addAddress)
router.get('/', getAddresses)
router.get('/:id', getAddressById)
router.put('/:id', updateAddress)
router.delete('/:id', deleteAddress)
export { router as addressesRouter}