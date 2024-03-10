import express from "express";
import {
    addExclusion,
    deleteExclusion,
    getExclusion,
    getExclusions,
    updateExclusion
} from "../controllers/exclusionsController.js";
import isAuth from "../middleware/isAuth.js";
const router = express.Router();
router.get('/', isAuth, getExclusions);
router.get('/:id', isAuth, getExclusion)
router.post('/', isAuth, addExclusion);
router.put('/:id', isAuth, updateExclusion);
router.delete('/:id', isAuth, deleteExclusion)
export { router as exclusionsRouter}