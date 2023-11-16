import DayFlexi from '../models/flexiModel.js'
//TODO: Add pagination here
export const getDays = async (req, res, next) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const flexiDays = await DayFlexi.find({}).skip((page - 1) * pageSize).limit(pageSize)
        .populate('morning_meals')
        .populate('lunch_meals')
        .populate('dinner_meals')
        .populate('teatime_meals')
        .populate('supper_meals');
    res.status(200)
    res.json(flexiDays);
}
export const getDay = async (req, res, next) => {
    const date = req.query.date;
    const flexiDay = await DayFlexi.findOne({date: date})
    if (!flexiDay) {
        res.status(404);
        return res.json({message: "Day not found"})
    }
    res.status(200);
    res.json(flexiDay);
}
export const createDayEntry = async (req, res, next) => {
    const dayData = req.body;
    const dayFlexi = new DayFlexi({
        date: dayData.date,
        morning_meals: dayData.morningMeals,
        lunch_meals: dayData.lunchMeals,
        dinner_meals: dayData.dinnerMeals,
        teatime_meals: dayData.teatimeMeals,
        supper_meals: dayData.supperMeals,
    })
    await dayFlexi.save()
    res.status(201);
    res.json({message: 'Day added!'})
}
export const updateDayEntry = async (req, res, next) => {
    const date = req.query.date;
    const dayData = req.body
    const flexiDay = await DayFlexi.updateOne({date: date}, dayData)
    res.status(200);
    res.json({message: `Day ${date} updated`})
}
//TODO: Add authorization token for this action
export const deleteDayEntry = async (req, res, next) => {
    const date = req.query.date;
    const deletedDay = await DayFlexi.findOneAndDelete({date: date});
    if (!deletedDay) {
        res.status(404);
        return res.json({message: `Assignment for the date: ${date} does not exist!`})
    }
    res.status(200);
    res.json({message: 'Day deleted! Make sure to add assignment for this day as soon as possible!'})
}
