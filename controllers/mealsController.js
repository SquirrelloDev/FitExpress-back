import Meal from '../models/mealsModel.js'
import fs from "fs";
import path from "path";
import crypto from "crypto";
export const getMeals = async (req,res,next) => {
    const meals = await Meal.find({}).populate('exclusions').populate('tags_id')
    if(meals){
        const mealsImage = meals.map((meal) => {
            let mealPath = path.join('public', 'images', meal.img_path);
            const data = fs.readFileSync(mealPath, {encoding: 'base64'})
            return {...meal._doc, imageBuffer: data}
        })
        res.status(200)
        res.json(mealsImage);
    }
}
export const getMealById = async (req,res,next) => {
    const id = req.params.id;
    const meal = await Meal.findById(id);
    if(!meal){
        res.status(404)
        return  res.json({message: 'Meal does not exist'});
    }
    res.status(200)
    res.json(meal)
}
export const createMeal = async (req,res,next) => {
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
    if(!createdMeal){
        res.status(500);
        return res.json({message: 'Error while creating a meal'})
    }
    res.status(201)
    res.json({message: 'Meal created!'});
}
export const updateMeal = async (req,res,next) => {
    const file = req.file
    const id = req.params.id
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
    if(fileUri !== existingMeal.img.uri){
        const mealPath = path.join('public', 'images', existingMeal.img.img_path)
        console.log(mealPath)
        fs.unlink(mealPath, (err) =>{
            if(err){
                throw (err)
            }
        })
    }
    res.status(200)
    res.json({message: 'Meal updated'})
}
export const deleteMeal = async (req,res,next) => {
    const id = req.params.id
    const deletedMeal = await Meal.findByIdAndDelete(id);
    if(!deletedMeal){
        res.status(404)
        return  res.json({message: 'Meal does not exist'});
    }
    const mealPath = path.join('public', 'images', deletedMeal.img.img_path)
    console.log(mealPath)
    fs.unlink(mealPath, (err) =>{
        if(err){
            throw (err)
        }
    })
    res.status(200);
    res.json({message: 'Meal deleted!'})
}
