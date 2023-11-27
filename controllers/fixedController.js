import DayFixed from '../models/fixedModel.js'
import {parseIntoMidnightISO} from "../utils/dates.js";
import {ApiError} from "../utils/errors.js";
//TODO: Add pagination here
export const getFixedDays = async (req, res, next) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
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
            })

        res.status(200)
        res.json(fixedDays);
    } catch (e) {
        next(e)
    }

}
export const getFixedDay = async (req, res, next) => {
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
export const createFixedDayEntry = async (req, res, next) => {
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
    const date = req.query.date;
    try {
        const isoDate = parseIntoMidnightISO(date);
        const dayData = req.body
        const fixedDay = await DayFixed.updateOne({date: isoDate}, dayData)
        res.status(200);
        res.json({message: `Day ${date} updated`})
    } catch (e) {
        next(e)
    }
}
export const deleteFixedDayEntry = async (req, res, next) => {
    const date = req.query.date;
    try {
        const isoDate = parseIntoMidnightISO(date)
        const deletedDay = await DayFixed.findOneAndDelete({date: isoDate});
        if (!deletedDay) {
            return next(ApiError(`Assignment for the date: ${date} does not exist!`, 404))
        }
        res.status(200);
        res.json({message: 'Day deleted! Make sure to add assignment for this day as soon as possible!'})
    } catch (e) {
        next(e);
    }
}
