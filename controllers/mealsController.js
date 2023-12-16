import Meal from '../models/mealsModel.js'
import fs from "fs";
import path from "path";
import crypto from "crypto";
import {ApiError} from "../utils/errors.js";
import {checkPermissions} from "../utils/auth.js";

export const getMeals = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    try {
        const meals = await Meal.find({}).populate('exclusions').populate('tags_id').skip((page - 1) * pageSize).limit(pageSize)
        if (meals) {
            const mealsImage = meals.map((meal) => {
                let mealPath = path.join('public', 'images', meal.img.img_path);
                const data = fs.readFileSync(mealPath, {encoding: 'base64'})
                return {...meal._doc, imageBuffer: data}
            })
            const totalItems = await Meal.find({}).countDocuments()
            res.status(200)
            res.json({
                meals: mealsImage,
                paginationInfo: {
                    totalItems,
                    hasNextPage: pageSize * page < totalItems,
                    hasPreviousPage: page > 1,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    lastPage: Math.ceil(totalItems / pageSize)
                }
            });
        }
    } catch (e) {
        next(e);
    }

}
export const getMealById = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    try {
        const meal = await Meal.findById(id).populate('exclusions').populate('tags_id');
        if (!meal) {
            return next(ApiError('Meal does not exist', 404))
        }

        res.status(200)
        res.json(meal)
    } catch (e) {
        next(e);
    }

}
export const createMeal = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    try {
        const mealData = JSON.parse(req.body.data);
        const file = req.file;
        const fileBytes = fs.readFileSync(file.path);
        const fileUri = crypto.createHash('sha1').update(fileBytes).digest('hex')
        const fileObj = {
            img_path: file.originalname,
            uri: fileUri
        }
        const meal = new Meal({
            ...mealData,
            img: fileObj,
            tags_id: mealData.tagsId,
            nutrition_values: mealData.nutritionValues
        })
        const createdMeal = await meal.save();
        if (!createdMeal) {
            return next(ApiError('Error while creating a meal'))
        }
        res.status(201)
        res.json({message: 'Meal created!'});
    } catch (e) {
        next(e);
    }

}
export const updateMeal = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const file = req.file
    const id = req.params.id
    try {
        const mealData = JSON.parse(req.body.data)
        const fileBytes = fs.readFileSync(file.path);
        const fileUri = crypto.createHash('sha1').update(fileBytes).digest('hex')
        const fileObj = {
            img_path: file.originalname,
            uri: fileUri
        }
        const existingMeal = await Meal.findByIdAndUpdate(id, {
            ...mealData,
            img: fileObj,
            tags_id: mealData.tagsId,
            nutrition_values: mealData.nutritionValues
        });
        if (fileUri !== existingMeal.img.uri) {
            const mealPath = path.join('public', 'images', existingMeal.img.img_path)
            console.log(mealPath)
            fs.unlink(mealPath, (err) => {
                if (err) {
                    return next(err);
                }
            })
        }
        res.status(200)
        res.json({message: 'Meal updated'})
    } catch (e) {
        next(e);
    }

}
export const deleteMeal = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id
    try {
        const deletedMeal = await Meal.findByIdAndDelete(id);
        if (!deletedMeal) {
            return next(ApiError('Meal does not exist', 404))
        }
        const mealPath = path.join('public', 'images', deletedMeal.img.img_path)
        console.log(mealPath)
        fs.unlink(mealPath, (err) => {
            if (err) {
                return next(err);
            }
        })
        res.status(200);
        res.json({message: 'Meal deleted!'})

    } catch (e) {
        next(e);
    }
}
