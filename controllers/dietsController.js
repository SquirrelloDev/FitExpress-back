import Diet from '../models/dietsModel.js'
import fs from "fs";
import path from "path";
export const getDiets = async(req,res,next) =>{
    const diets = await Diet.find({}).populate('exclusions');
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
    const diet = await Diet.findById(id).populate('exclusions');
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
    const newDiet = new Diet({
        ...dietData,
        diet_type: dietData.dietType,
        img_path: file.originalname,
        short_desc: dietData.shortDesc,
        long_desc: dietData.longDesc,
        basic_info: dietData.basicInfo,
    })
    await newDiet.save();
    res.status(201);
    res.json({message: 'Diet created!'})
}
export const updateDiet = async (req,res,next) => {
    //TODO: Remove old image from disk
    const id = req.params.id;
    const file = req.file;
    const dietData = JSON.parse(req.body.data);
    const diet = await Diet.findByIdAndUpdate(id, {
        ...dietData,
        img_path: file.originalname,
        short_desc: dietData.shortDesc,
        long_desc: dietData.longDesc,
        basic_info: dietData.basicInfo
    })
    res.status(200);
    res.json({message: 'Diet updated!'})
}
export const deleteDiet = async (req,res,next) => {
    //meals are not affected
    //only for admin!
    const id = req.params.id
    const deletedDiet = await Diet.findByIdAndDelete(id)
    if(!deletedDiet){
        res.status(404);
        return res.json({mmessage: 'Diet does not exist!'})
    }
    res.status(200);
    res.json({message: 'diet deleted!'})
}