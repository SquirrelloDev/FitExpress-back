import express from "express";
import multer from "multer";
import {createMeal, deleteMeal, getMealById, getMeals, updateMeal} from "../controllers/mealsController.js";
const router = express.Router();
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
router.get('/', getMeals);
router.get('/:id', getMealById)
router.post('/', upload.single('image'), createMeal);
router.put('/:id', upload.single('image'), updateMeal);
router.delete('/:id', deleteMeal)

export { router as mealsRouter }