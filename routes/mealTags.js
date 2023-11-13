import express from "express";
import {addTag, deleteTag, getTags, updateTag} from "../controllers/mealTagsController.js";
const router = express.Router();
router.get('/', getTags);
router.post('/', addTag);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag)
export { router as mealTagsRouter }