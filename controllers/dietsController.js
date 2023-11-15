import Diet from '../models/dietsModel.js'
import fs from "fs";
import path from "path";
import crypto from "crypto";
export const getDiets = async(req,res,next) =>{
    const diets = await Diet.find({}).populate('exclusions').populate('tags_id');
    if(diets){
        const dietsImage = diets.map((diet) => {
            let dietPath = path.join('public', 'images', diet.img_path);
            const data = fs.readFileSync(dietPath, {encoding: 'base64'})
            return {...diet._doc, imageBuffer: data}
        })
        res.status(200);
        res.json(dietsImage)
    }
}
export const getDiet = async (req,res,next) => {
    const id= req.params.id;
    const diet = await Diet.findById(id).populate('exclusions').populate('tags_id');
    if(!diet){
        res.status(404);
        return res.json({message: 'Diet does not exist!'})
    }
    res.status(200)
    res.json(diet)
}
export const createDiet = async (req,res,next) => {
    const file = req.file;
    const dietData = JSON.parse(req.body.data)
    const existingDiet = await Diet.findOne({name: dietData.name});
    if(existingDiet){
        res.status(500)
        return res.json({message: 'Diet already exist!'})
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
}
export const updateDiet = async (req,res,next) => {
    const id = req.params.id;
    const file = req.file;
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
    if(fileUri !== diet.img.uri){
        const dietPath = path.join('public', 'images', diet.img.img_path)
        fs.unlink(dietPath, (err) =>{
        if(err){
            throw (err)
        }
        })
    }
    res.status(200);
    res.json({message: 'Diet updated!'})
}
//action only for admin!
export const deleteDiet = async (req,res,next) => {
    //meals are not affected
    const id = req.params.id
    const deletedDiet = await Diet.findByIdAndDelete(id)
    if(!deletedDiet){
        res.status(404);
        return res.json({mmessage: 'Diet does not exist!'})
    }
    const mealPath = path.join('public', 'images', deletedDiet.img.img_path)
    console.log(mealPath)
    fs.unlink(mealPath, (err) =>{
        if(err){
            throw (err)
        }
    })
    res.status(200);
    res.json({message: 'diet deleted!'})
}