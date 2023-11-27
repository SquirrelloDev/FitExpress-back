import Exclusion from '../models/exclusionsModel.js'
import Meal from '../models/mealsModel.js'
import Diet from '../models/dietsModel.js'
import {ApiError} from "../utils/errors.js";

export const getExclusions = async (req, res, next) => {
    try {
        const exclusions = await Exclusion.find({});
        res.status(200);
        res.json(exclusions)

    } catch (e) {
        next(e);
    }
}
export const addExclusion = async (req, res, next) => {
    const exclusionName = req.body.name;
    try {
        const existingExclusion = await Exclusion.findOne({name: exclusionName})
        if (existingExclusion) {
            return next(ApiError('Exclusion already exists!', 409))
        }
        const exclusion = new Exclusion({
            name: exclusionName
        })
        const createdExclusion = await exclusion.save()
        if (!createdExclusion) {
            return next(ApiError('Error while creating an exclusion'))
        }
        res.status(201)
        res.json({message: 'Exclusion added'})

    } catch (e) {
        next(e);
    }
}
export const updateExclusion = async (req, res, next) => {
    const exclusionName = req.body.name;
    const id = req.params.id
    try {
        const updatedExclusion = await Exclusion.findByIdAndUpdate(id, {name: exclusionName})
        if (!updatedExclusion) {
            return next(ApiError('Error while updating an exclusion'))
        }
        res.status(200)
        res.json({message: 'Exclusion updated'})

    } catch (e) {
        next(e);
    }
}
export const deleteExclusion = async (req, res, next) => {
    const id = req.params.id
    try {
        const deletedExclusion = await Exclusion.findByIdAndDelete(id);
        if (!deletedExclusion) {
            return next(ApiError('Exclusion not found!', 404))
        }
        await Meal.updateMany({}, {$pull: {"exclusions": deletedExclusion._id}});
        await Diet.updateMany({}, {$pull: {"exclusions": deletedExclusion._id}});
        res.status(200);
        res.json({message: 'Exclusion deleted!'})

    } catch (e) {
        next(e);
    }
}