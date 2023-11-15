import Tag from '../models/mealTagsModel.js'
import Meal from "../models/mealsModel.js";
import Diet from "../models/dietsModel.js";
export const getTags = async (req,res,next) => {
    const tags = await Tag.find({});
    res.status(200);
    res.json(tags)
}
export const addTag = async (req,res,next) => {
    const tagData = req.body;
    const existingTag = await Tag.findOne({name: tagData.name})
    if(existingTag){
        res.status(500)
        return res.json({message: 'Tag already exists!'})
    }
    const tag = new Tag({
        name: tagData.name,
        description: tagData.description,
        icon: tagData.icon,
    })
    const createdTag = await tag.save()
    if(!createdTag){
        res.status(500);
        return res.json({message: 'Error while creating a tag'})
    }
    res.status(200);
    res.json({message: 'New tag added'})
}
export const updateTag = async(req,res,next) => {
    const id = req.params.id;
    const tagData = req.body;
    const updatedTag = await Tag.findByIdAndUpdate(id, tagData)
    if (!updatedTag) {
        res.status(500);
        return res.json({message: 'Error while creating a tag'})
    }
    res.status(200)
    res.json({message: 'Tag updated'})
}
export const deleteTag = async (req,res,next) => {
    const id = req.params.id;
    const deletedTag = await Tag.findByIdAndDelete(id);
    if(!deletedTag){
        res.status(404);
        return  res.json({message: 'Tag not found!'})
    }
    await Meal.updateMany({}, {$pull: {"tags_id": deletedTag._id}});
    await Diet.updateMany({}, {$pull: {"tags_id": deletedTag._id}});
    res.status(200);
    res.json({message: 'Tag deleted!'})
}