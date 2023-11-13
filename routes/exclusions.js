import express from "express";
import {addExclusion, deleteExclusion, getExclusions, updateExclusion} from "../controllers/exclusionsController.js";
const router = express.Router();
router.get('/', getExclusions);
router.post('/', addExclusion);
router.put('/:id', updateExclusion);
router.delete('/:id', deleteExclusion)
export { router as exclusionsRouter}