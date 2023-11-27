import express from "express";
import {
    addAddress,
    deleteAddress,
    getAddressById,
    getAddresses, getUserAddresses,
    updateAddress
} from "../controllers/addressesController.js";
import isAuth from "../middleware/isAuth.js";
const router = express.Router()
router.post('/', isAuth, addAddress)
router.get('/', isAuth, getAddresses)
router.get('/:id', isAuth, getAddressById)
router.get('/user/:id', isAuth, getUserAddresses);
router.put('/:id', isAuth, updateAddress)
router.delete('/:id', isAuth, deleteAddress)
export { router as addressesRouter}