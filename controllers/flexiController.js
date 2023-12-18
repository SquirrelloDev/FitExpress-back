import DayFlexi from '../models/flexiModel.js'
import {ApiError} from "../utils/errors.js";
import {checkPermissions} from "../utils/auth.js";

export const getDays = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    try {
        const flexiDays = await DayFlexi.find({}).skip((page - 1) * pageSize).limit(pageSize)
            .populate('morning_meals')
            .populate('lunch_meals')
            .populate('dinner_meals')
            .populate('teatime_meals')
            .populate('supper_meals');
        const totalItems = await DayFlexi.find({}).countDocuments()
        res.status(200)
        res.json({
            flexiDays,
            paginationInfo: {
                totalItems,
                hasNextPage: pageSize * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / pageSize)
            }
        });
    } catch (e) {
        next(e);
    }

}
export const getDay = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
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
export const getDayById = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id
    try {
        const flexiDay = await DayFlexi.findById(id).populate('morning_meals')
            .populate('lunch_meals')
            .populate('dinner_meals')
            .populate('teatime_meals')
            .populate('supper_meals')
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
    if (!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const dayData = req.body;
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
    if (!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    const dayData = req.body
    try {
        const flexiDay = await DayFlexi.findByIdAndUpdate(id, dayData)
        res.status(200);
        res.json({message: 'Day updated'})
    } catch (e) {
        next(e);
    }
}
export const deleteDayEntry = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    try {
        const deletedDay = await DayFlexi.findByIdAndDelete(id);
        if (!deletedDay) {
            return next(ApiError(`Assignment for the date does not exist!`, 404))
        }
        res.status(200);
        res.json({message: 'Day deleted! Make sure to add assignment for this day as soon as possible!'})
    } catch (e) {
        next(e);
    }

}
