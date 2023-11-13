import express from "express";
import {createMeal, deleteMeal, getMealById, getMeals, updateMeal} from "../controllers/mealsController.js";
import multer from "multer";
const diskStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'public/images')
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
})
const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }
    else{
        cb(null, false)
    }
}

const upload = multer({storage: diskStorage, fileFilter: fileFilter})
const router = express.Router();
router.get('/', getMeals);
router.get('/:id', getMealById)
router.post('/', upload.single('image'), createMeal);
router.put('/:id', upload.single('image'), updateMeal)
router.delete('/:id', deleteMeal)

export { router as mealsRouter }