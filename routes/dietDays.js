import express from "express";
import {createDayEntry, deleteDayEntry, getDay, getDays, updateDayEntry} from "../controllers/flexiController.js";
const router = express.Router();
router.get('/flexi/', getDays);
router.get('/flexi/day', getDay);
router.post('/flexi/', createDayEntry);
router.put('/flexi/day', updateDayEntry);
router.delete('/flexi/day', deleteDayEntry)
export { router as dietDaysRouter }