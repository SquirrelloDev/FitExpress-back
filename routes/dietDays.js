import express from "express";
import {createDayEntry, deleteDayEntry, getDay, getDays, updateDayEntry} from "../controllers/flexiController.js";
import {
    createFixedDayEntry,
    deleteFixedDayEntry,
    getFixedDay,
    getFixedDays,
    updateFixedDayEntry
} from "../controllers/fixedController.js";

const router = express.Router();
//-----------FLEXI---------------
router.get('/flexi/', getDays);
router.get('/flexi/day', getDay);
router.post('/flexi/', createDayEntry);
router.put('/flexi/day', updateDayEntry);
router.delete('/flexi/day', deleteDayEntry);
//----------FIXED-----------------
router.get('/fixed', getFixedDays);
router.get('/fixed/day', getFixedDay);
router.post('/fixed', createFixedDayEntry);
router.put('/fixed/day', updateFixedDayEntry);
router.delete('/fixed/day', deleteFixedDayEntry)
export {router as dietDaysRouter}