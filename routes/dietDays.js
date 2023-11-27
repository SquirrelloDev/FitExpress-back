import express from "express";
import {createDayEntry, deleteDayEntry, getDay, getDays, updateDayEntry} from "../controllers/flexiController.js";
import {
    createFixedDayEntry,
    deleteFixedDayEntry,
    getFixedDay,
    getFixedDays,
    updateFixedDayEntry
} from "../controllers/fixedController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();
//-----------FLEXI---------------
router.get('/flexi/', isAuth, getDays);
router.get('/flexi/day', isAuth, getDay);
router.post('/flexi/', isAuth, createDayEntry);
router.put('/flexi/day', isAuth, updateDayEntry);
router.delete('/flexi/day', isAuth, deleteDayEntry);
//----------FIXED-----------------
router.get('/fixed', isAuth, getFixedDays);
router.get('/fixed/day', isAuth, getFixedDay);
router.post('/fixed', isAuth, createFixedDayEntry);
router.put('/fixed/day', isAuth, updateFixedDayEntry);
router.delete('/fixed/day', isAuth, deleteFixedDayEntry)
export {router as dietDaysRouter}