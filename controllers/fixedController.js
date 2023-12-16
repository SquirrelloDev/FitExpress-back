import DayFixed from '../models/fixedModel.js'
import {parseIntoMidnightISO} from "../utils/dates.js";
import {ApiError} from "../utils/errors.js";
import {checkPermissions} from "../utils/auth.js";
export const getFixedDays = async (req, res, next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    try {
        const fixedDays = await DayFixed.find({}).skip((page - 1) * pageSize).limit(pageSize)
            .populate({
                path: 'diets',
                populate: {
                    path: 'diet_id'
                }
            }).populate({
                path: 'diets',
                populate: {
                    path: 'meals.morning',
                }
            }).populate({
                path: 'diets',
                populate: {
                    path: 'meals.lunch',
                }
            }).populate({
                path: 'diets',
                populate: {
                    path: 'meals.dinner',
                }
            }).populate({
                path: 'diets',
                populate: {
                    path: 'meals.teatime',
                }
            }).populate({
                path: 'diets',
                populate: {
                    path: 'meals.supper',
                }
            });
        const totalItems = await DayFixed.find({}).countDocuments();

        res.status(200)
        res.json({
            fixedDays,
            paginationInfo: {
                totalItems,
                hasNextPage: pageSize * page < totalItems,
                hasPrevoiusPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems/pageSize)
            }
        });
    } catch (e) {
        next(e)
    }

}
export const getFixedDay = async (req, res, next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const date = req.query.date;
    try {
        const isoDate = parseIntoMidnightISO(date);
        const fixedDay = await DayFixed.findOne({date: isoDate}).populate({
            path: 'diets',
            populate: {
                path: 'diet_id'
            }
        }).populate({
            path: 'diets',
            populate: {
                path: 'meals.morning',
            }
        }).populate({
            path: 'diets',
            populate: {
                path: 'meals.lunch',
            }
        }).populate({
            path: 'diets',
            populate: {
                path: 'meals.dinner',
            }
        }).populate({
            path: 'diets',
            populate: {
                path: 'meals.teatime',
            }
        }).populate({
            path: 'diets',
            populate: {
                path: 'meals.supper',
            }
        })
        if (!fixedDay) {
            return next(ApiError("Day not found", 404))
        }
        res.status(200);
        res.json(fixedDay);
    } catch (e) {
        next(e);
    }
}
export const getFixedDayById = async (req, res, next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    try {
        const fixedDay = await DayFixed.findById(id).populate({
            path: 'diets',
            populate: {
                path: 'diet_id'
            }
        }).populate({
            path: 'diets',
            populate: {
                path: 'meals.morning',
            }
        }).populate({
            path: 'diets',
            populate: {
                path: 'meals.lunch',
            }
        }).populate({
            path: 'diets',
            populate: {
                path: 'meals.dinner',
            }
        }).populate({
            path: 'diets',
            populate: {
                path: 'meals.teatime',
            }
        }).populate({
            path: 'diets',
            populate: {
                path: 'meals.supper',
            }
        })
        if (!fixedDay) {
            return next(ApiError("Day not found", 404))
        }
        res.status(200);
        res.json(fixedDay);
    } catch (e) {
        next(e);
    }
}
export const createFixedDayEntry = async (req, res, next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const dayData = req.body;
    const dayFixed = new DayFixed(dayData)
    try {
        await dayFixed.save()
        res.status(201);
        res.json({message: 'Day added!'})
    } catch (e) {
        next(e)
    }

}
export const updateFixedDayEntry = async (req, res, next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.date;
    try {
        const dayData = req.body
        const fixedDay = await DayFixed.findByIdAndUpdate(id, dayData)
        res.status(200);
        res.json({message: `Day ${date} updated`})
    } catch (e) {
        next(e)
    }
}
export const deleteFixedDayEntry = async (req, res, next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.date;
    try {
        const deletedDay = await DayFixed.findByIdAndDelete(id);
        if (!deletedDay) {
            return next(ApiError(`Assignment for the date: ${date} does not exist!`, 404))
        }
        res.status(200);
        res.json({message: 'Day deleted! Make sure to add assignment for this day as soon as possible!'})
    } catch (e) {
        next(e);
    }
}
