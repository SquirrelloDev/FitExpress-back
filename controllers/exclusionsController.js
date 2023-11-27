import Exclusion from '../models/exclusionsModel.js'
import Meal from '../models/mealsModel.js'
import Diet from '../models/dietsModel.js'
import {ApiError} from "../utils/errors.js";
import {checkPermissions} from "../utils/auth.js";

export const getExclusions = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    try {
        const exclusions = await Exclusion.find({}).skip((page - 1) * pageSize).limit(pageSize);
        const totalItems = await Exclusion.find({}).countDocuments();
        res.status(200);
        res.json({
            exclusions,
            paginationInfo: {
                totalItems,
                hasNextPage: pageSize * page < totalItems,
                haPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / pageSize)
            }
        })

    } catch (e) {
        next(e);
    }
}
export const addExclusion = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
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
    if (!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
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
    if (!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
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