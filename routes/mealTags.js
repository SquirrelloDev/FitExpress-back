import express from "express";
import {addTag, deleteTag, getTags, updateTag} from "../controllers/mealTagsController.js";
import isAuth from "../middleware/isAuth.js";
const router = express.Router();
router.get('/', isAuth, getTags);
router.post('/', isAuth, addTag);
router.put('/:id', isAuth, updateTag);
router.delete('/:id', isAuth, deleteTag)
export { router as mealTagsRouter }