import Diet from '../models/dietsModel.js'
import fs from "fs";
import path from "path";
import crypto from "crypto";
import {ApiError} from "../utils/errors.js";

export const getDiets = async (req, res, next) => {
    //CAUTION! Here will be also fetched the generic flexi diet! With this syntax we will get only fixed diets
    try {
        const diets = await Diet.find({diet_type: 'Fixed'}).populate('exclusions').populate('tags_id');
        if (diets) {
            const dietsImage = diets.map((diet) => {
                let dietPath = path.join('public', 'images', diet.img.img_path);
                const data = fs.readFileSync(dietPath, {encoding: 'base64'})
                return {...diet._doc, imageBuffer: data}
            })
            res.status(200);
            res.json(dietsImage)
        }

    } catch (e) {
        next(e);
    }
}
export const getDiet = async (req, res, next) => {
    const id = req.params.id;
    try {
        const diet = await Diet.findById(id).populate('exclusions').populate('tags_id');
        if (!diet) {
            return next(ApiError('Diet does not exist!', 404))
        }
        const dietImgPath = path.join('public', 'images', diet.img.img_path)
        const imgData = fs.readFileSync(dietImgPath, {encoding: 'base64'});
        res.status(200)
        res.json({...diet._doc, imageBuffer: imgData});

    } catch (e) {
        next(e);
    }
}
export const createDiet = async (req, res, next) => {
    const file = req.file;
    try {
        const dietData = JSON.parse(req.body.data)
        const existingDiet = await Diet.findOne({name: dietData.name});
        if (existingDiet) {
            return next(ApiError('Diet already exist!', 409))
        }
        const fileBytes = fs.readFileSync(file.path);
        const fileUri = crypto.createHash('sha1').update(fileBytes).digest('hex')
        const imgObj = {
            img_path: file.originalname,
            uri: fileUri
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
    const id = req.params.id;
    const file = req.file;
    try {
        const dietData = JSON.parse(req.body.data);
        const fileBytes = fs.readFileSync(file.path);
        const fileUri = crypto.createHash('sha1').update(fileBytes).digest('hex')
        const fileObj = {
            img_path: file.originalname,
            uri: fileUri
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
            fs.unlink(dietPath, (err) => {
                if (err) {
                    return next(err);
                }
            })
        }
        res.status(200);
        res.json({message: 'Diet updated!'})

    } catch (e) {
        next(e);
    }
}
//action only for admin!
export const deleteDiet = async (req, res, next) => {
    //meals are not affected
    const id = req.params.id
    try {
        const deletedDiet = await Diet.findByIdAndDelete(id)
        if (!deletedDiet) {
            return next(ApiError('Diet does not exist!', 404))
        }
        const mealPath = path.join('public', 'images', deletedDiet.img.img_path)
        console.log(mealPath)
        fs.unlink(mealPath, (err) => {
            if (err) {
                throw (err)
            }
        })
        res.status(200);
        res.json({message: 'diet deleted!'})
    } catch (e) {
        next(e);
    }

}