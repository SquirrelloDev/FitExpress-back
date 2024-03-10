import Diet from '../models/dietsModel.js'
import fs from "fs";
import path from "path";
import crypto from "crypto";
import {ApiError} from "../utils/errors.js";
import {checkPermissions} from "../utils/auth.js";
import Meal from "../models/mealsModel.js";

export const getDiets = async (req, res, next) => {
    if(!await checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const dietType = String(req.query.dietType);
    //CAUTION! Here will be also fetched the generic flexi diet! With this syntax we will get only fixed diets
    try {
        const diets = await Diet.find(dietType ? {diet_type: dietType} : {}).populate('exclusions').populate('tags_id').skip((page - 1) * pageSize).limit(pageSize);
        if (diets) {
            const dietsImage = diets.map((diet) => {
                if(diet.img.img_path === ''){
                    return {...diet._doc, imageBuffer: null}
                }
                let dietPath = path.join('public', 'images', diet.img.img_path);
                const data = fs.readFileSync(dietPath, {encoding: 'base64'})
                return {...diet._doc, imageBuffer: data}
            })
            const totalItems = await Diet.find({diet_type: 'Fixed'}).countDocuments()
            res.status(200);
            res.json({
                diets: dietsImage,
                paginationInfo: {
                    totalItems,
                    hasNextPage: pageSize * page < totalItems,
                    hasPreviousPage: page > 1,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    lastPage: Math.ceil(totalItems / pageSize)
                }
            })
        }

    } catch (e) {
        next(e);
    }
}
export const getDiet = async (req, res, next) => {
    if(!await checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    let imgData = null;
    try {
        const diet = await Diet.findById(id).populate('exclusions').populate('tags_id');
        if (!diet) {
            return next(ApiError('Diet does not exist!', 404))
        }
        const dietImgPath = path.join('public', 'images', diet.img.img_path)
        if(diet.img.img_path !== ''){
         imgData = fs.readFileSync(dietImgPath, {encoding: 'base64'});
        }
        res.status(200)
        res.json({...diet._doc, imageBuffer: imgData});

    } catch (e) {
        next(e);
    }
}
export const createDiet = async (req, res, next) => {
    if(!await checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const file = req.file;
    let imgObj = {img_path: '', uri: ''};
    try {
        const dietData = JSON.parse(req.body.data)
        const existingDiet = await Diet.findOne({name: dietData.name});
        if (existingDiet) {
            return next(ApiError('Diet already exist!', 409))
        }
        if(file){
        const fileBytes = fs.readFileSync(file.path);
        const fileUri = crypto.createHash('sha1').update(fileBytes).digest('hex');
         imgObj = {
            img_path: file.originalname,
            uri: fileUri
        }

        }
        const newDiet = new Diet({
            ...dietData,
            diet_type: dietData.dietType,
            img: imgObj,
            short_desc: dietData.shortDesc,
            long_desc: dietData.longDesc,
            basic_info: dietData.basicInfo,
        })
        await newDiet.save();
        res.status(201);
        res.json({message: 'Diet created!'})

    } catch (e) {
        next(e);
    }
}
export const updateDiet = async (req, res, next) => {
    if(!await checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    let fileObj = {img_path: '', uri: ''}
    let fileUri = ''
    const file = req.file;
    try {
        const dietData = JSON.parse(req.body.data);
        if(file){
        const fileBytes = fs.readFileSync(file.path);
        fileUri = crypto.createHash('sha1').update(fileBytes).digest('hex')
            fileObj = {
            img_path: file.originalname,
            uri: fileUri
        }

        }

        const diet = await Diet.findByIdAndUpdate(id, {
            ...dietData,
            img: fileObj,
            short_desc: dietData.shortDesc,
            long_desc: dietData.longDesc,
            basic_info: dietData.basicInfo
        })
        //compare image uris
        if (fileUri !== diet.img.uri) {
            const dietPath = path.join('public', 'images', diet.img.img_path)
            if(diet.img.img_path !== ''){
                const mealsWithSameImage = await Meal.find({"img.img_path": diet.img.img_path})
                const dietsWithSameImage = await Diet.find({"img.img_path": diet.img.img_path})
                if(mealsWithSameImage.length === 0 && dietsWithSameImage.length === 0){
                    fs.unlink(dietPath, (err) => {
                        if (err) {
                            return next(err);
                        }
                    })
                }
            }
        }
        res.status(200);
        res.json({message: 'Diet updated!'})

    } catch (e) {
        next(e);
    }
}
//action only for admin!
export const deleteDiet = async (req, res, next) => {
    if(!await checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    //meals are not affected
    const id = req.params.id
    try {
        const deletedDiet = await Diet.findByIdAndDelete(id)
        if (!deletedDiet) {
            return next(ApiError('Diet does not exist!', 404))
        }
        const mealPath = path.join('public', 'images', deletedDiet.img.img_path)
        console.log(mealPath)
        if(deletedDiet.img.img_path !== ''){
            const mealsWithSameImage = await Meal.find({"img.img_path": deletedDiet.img.img_path})
            const dietsWithSameImage = await Diet.find({"img.img_path": deletedDiet.img.img_path})
            if(mealsWithSameImage.length === 0 && dietsWithSameImage.length === 0){
                fs.unlink(mealPath, (err) => {
                    if (err) {
                        return next(err);
                    }
                })
            }
        }
        res.status(200);
        res.json({message: 'diet deleted!'})
    } catch (e) {
        next(e);
    }

}