import express from "express";
import {
    addEntry,
    deleteEntry,
    getAllProgress,
    getProgressByUser,
    updateEntry
} from "../controllers/progressEntryController.js";
const router = express.Router();
router.get('/', getAllProgress);
router.get('/user', getProgressByUser);
router.put('/', addEntry);
router.patch('/', updateEntry);
router.delete('/', deleteEntry);
export {router as entriesRouter}