import express from "express";
import multer from "multer";
import {createDiet, deleteDiet, getDiet, getDiets, updateDiet} from "../controllers/dietsController.js";
import isAuth from "../middleware/isAuth.js";
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
router.get('/', isAuth, getDiets);
router.get('/:id', isAuth, getDiet)
router.post('/', isAuth, upload.single('image'), createDiet);
router.put('/:id', isAuth, upload.single('image'), updateDiet)
router.delete('/:id', isAuth, deleteDiet)

export { router as dietsRouter }