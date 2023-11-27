import DayFlexi from '../models/flexiModel.js'
import {ApiError} from "../utils/errors.js";
//TODO: Add pagination here
export const getDays = async (req, res, next) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    try {
        const flexiDays = await DayFlexi.find({}).skip((page - 1) * pageSize).limit(pageSize)
            .populate('morning_meals')
            .populate('lunch_meals')
            .populate('dinner_meals')
            .populate('teatime_meals')
            .populate('supper_meals');
        res.status(200)
        res.json(flexiDays);
    } catch (e) {
        next(e);
    }

}
export const getDay = async (req, res, next) => {
    const date = req.query.date;
    try {
        const flexiDay = await DayFlexi.findOne({date: date})
        if (!flexiDay) {
            return next(ApiError("Day not found", 404))
        }
        res.status(200);
        res.json(flexiDay);

    } catch (e) {
        next(e);
    }
}
export const createDayEntry = async (req, res, next) => {
    const dayData = req.body;
    //TODO: check if there is no enrty with the same date
    try {
        const dayFlexi = new DayFlexi({
            date: dayData.date,
            morning_meals: dayData.morningMeals,
            lunch_meals: dayData.lunchMeals,
            dinner_meals: dayData.dinnerMeals,
            teatime_meals: dayData.teatimeMeals,
            supper_meals: dayData.supperMeals,
        })
        await dayFlexi.save()
    } catch (e) {
        return next(ApiError('Day with provided date already exist!', 409))
    }
    res.status(201);
    res.json({message: 'Day added!'})
}
export const updateDayEntry = async (req, res, next) => {
    const date = req.query.date;
    const dayData = req.body
    try {
        const flexiDay = await DayFlexi.updateOne({date: date}, dayData)
        res.status(200);
        res.json({message: `Day ${date} updated`})
    } catch (e) {
        next(e);
    }
}
export const deleteDayEntry = async (req, res, next) => {
    const date = req.query.date;
    try {
        const deletedDay = await DayFlexi.findOneAndDelete({date: date});
        if (!deletedDay) {
            return next(ApiError(`Assignment for the date: ${date} does not exist!`, 404))
        }
        res.status(200);
        res.json({message: 'Day deleted! Make sure to add assignment for this day as soon as possible!'})
    } catch (e) {
        next(e);
    }

}
