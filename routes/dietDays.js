import express from "express";
import {
    createDayEntry,
    deleteDayEntry,
    getDay,
    getDayById,
    getDays,
    updateDayEntry
} from "../controllers/flexiController.js";
import {
    createFixedDayEntry,
    deleteFixedDayEntry,
    getFixedDay, getFixedDayById,
    getFixedDays,
    updateFixedDayEntry
} from "../controllers/fixedController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();
//-----------FLEXI---------------
router.get('/flexi/', isAuth, getDays);
router.get('/flexi/day', isAuth, getDay);
router.get('/flexi/:id', isAuth, getDayById);
router.post('/flexi/', isAuth, createDayEntry);
router.put('/flexi/:id', isAuth, updateDayEntry);
router.delete('/flexi/:id', isAuth, deleteDayEntry);
//----------FIXED-----------------
router.get('/fixed', isAuth, getFixedDays);
router.get('/fixed/day', isAuth, getFixedDay);
router.get('/fixed/:id', isAuth, getFixedDayById);
router.post('/fixed', isAuth, createFixedDayEntry);
router.put('/fixed/:id', isAuth, updateFixedDayEntry);
router.delete('/fixed/:id', isAuth, deleteFixedDayEntry)
export {router as dietDaysRouter}