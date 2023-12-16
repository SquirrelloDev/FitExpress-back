import Tag from '../models/mealTagsModel.js'
import Meal from "../models/mealsModel.js";
import Diet from "../models/dietsModel.js";
import {ApiError} from "../utils/errors.js";
import {checkPermissions} from "../utils/auth.js";

export const getTags = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    try {
        const tags = await Tag.find({}).skip((page - 1) * pageSize).limit(pageSize);
        const totalItems = await Tag.find({}).countDocuments();
        res.status(200);
        res.json({
            tags,
            paginationInfo: {
                totalItems,
                hasNextPage: pageSize * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / pageSize)
            }
        })

    } catch (e) {
        next(e);
    }
}
export const addTag = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const tagData = req.body;
    try {
        const existingTag = await Tag.findOne({name: tagData.name})
        if (existingTag) {
            return next(ApiError('Tag already exists!', 409))
        }
        const tag = new Tag({
            name: tagData.name,
            description: tagData.description,
            icon: tagData.icon,
        })
        const createdTag = await tag.save()
        if (!createdTag) {
            return next(ApiError('Error while creating a tag'))
        }
        res.status(200);
        res.json({message: 'New tag added'})
    } catch (e) {
        next(e);
    }

}
export const updateTag = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    const tagData = req.body;
    try {
        const updatedTag = await Tag.findByIdAndUpdate(id, tagData)
        if (!updatedTag) {
            return next(ApiError('Error while creating a tag'))
        }
        res.status(200)
        res.json({message: 'Tag updated'})
    } catch (e) {
        next(e);
    }

}
export const deleteTag = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    try {
        const deletedTag = await Tag.findByIdAndDelete(id);
        if (!deletedTag) {
            return next(ApiError('Tag not found!', 404))
        }
        await Meal.updateMany({}, {$pull: {"tags_id": deletedTag._id}});
        await Diet.updateMany({}, {$pull: {"tags_id": deletedTag._id}});
        res.status(200);
        res.json({message: 'Tag deleted!'})

    } catch (e) {
        next(e);
    }
}