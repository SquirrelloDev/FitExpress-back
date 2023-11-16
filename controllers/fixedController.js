import DayFixed from '../models/fixedModel.js'
//TODO: Add pagination here
export const getFixedDays = async (req, res, next) => {
    const fixedDays = await DayFixed.find({})
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
}
export const getFixedDay = async (req, res, next) => {
    const date = req.query.date;
    const fixedDay = await DayFixed.findOne({date: date}).populate({
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
        res.status(404);
        return res.json({message: "Day not found"})
    }
    res.status(200);
    res.json(fixedDay);
}
export const createFixedDayEntry = async (req, res, next) => {
    const dayData = req.body;
    const dayFixed = new DayFixed(dayData)
    await dayFixed.save()
    res.status(201);
    res.json({message: 'Day added!'})
}
export const updateFixedDayEntry = async (req, res, next) => {
    const date = req.query.date;
    const dayData = req.body
    const fixedDay = await DayFixed.updateOne({date: date}, dayData)
    res.status(200);
    res.json({message: `Day ${date} updated`})
}
//TODO: Check authorization token for this action
export const deleteFixedDayEntry = async (req, res, next) => {
    const date = req.query.date;
    const deletedDay = await DayFixed.findOneAndDelete({date: date});
    if (!deletedDay) {
        res.status(404);
        return res.json({message: `Assignment for the date: ${date} does not exist!`})
    }
    res.status(200);
    res.json({message: 'Day deleted! Make sure to add assignment for this day as soon as possible!'})
}
