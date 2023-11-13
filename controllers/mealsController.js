import Meal from '../models/mealsModel.js'
import fs from "fs";
import path from "path";
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
    const mealPath = path.join('public', 'images', meal.img_path)
    fs.readFile(mealPath, 'base64',(err, data) => {
        if(err){
            next(err)
        }
        res.status(200)
        res.json({...meal._doc, fileBuffer: data})
    })

}
export const createMeal = async (req,res,next) => {
    const file = req.file;
    const mealData = JSON.parse(req.body.data)
    const meal = new Meal({
        ...mealData,
        img_path: file.originalname,
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
    const existingMeal = await Meal.findByIdAndUpdate(id, {
        ...mealData,
        img_path: file.originalname,
        tags_id: mealData.tagsId,
        nutrition_values: mealData.nutritionValues
    });
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
    const mealPath = path.join('public', 'images', deletedMeal.img_path)
    console.log(mealPath)
    fs.unlink(mealPath, (err) =>{
        if(err){
            throw (err)
        }
    })
    res.status(200);
    res.json({message: 'Meal deleted!'})
}
