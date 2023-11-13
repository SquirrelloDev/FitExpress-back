import express from "express";
import {createMeal, deleteMeal, getMealById, getMeals} from "../controllers/mealsController.js";
const router = express.Router();
router.get('/', getMeals);
router.get('/:id', getMealById)
router.post('/', createMeal);
router.delete('/:id', deleteMeal)

export { router as mealsRouter }