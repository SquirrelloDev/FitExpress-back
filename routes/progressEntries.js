import express from "express";
import {
    addEntry,
    deleteEntry,
    getAllProgress,
    getProgressByUser,
    updateEntry
} from "../controllers/progressEntryController.js";
import isAuth from "../middleware/isAuth.js";
const router = express.Router();
router.get('/', isAuth, getAllProgress);
router.get('/user', isAuth, getProgressByUser);
router.put('/', isAuth, addEntry);
router.patch('/', isAuth, updateEntry);
router.delete('/', isAuth, deleteEntry);
export {router as entriesRouter}