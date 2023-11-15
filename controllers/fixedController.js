import DayFixed from '../models/fixedModel.js'
//TODO: Add pagination here
export const getDays = async (req,res,next) => {
    const fixedDays = await DayFixed.find({})
        .populate({
            path: 'diets',
        });
    res.status(200)
    res.json(flexiDays);
}
export const getDay = async (req,res,next) => {
    const date = req.query.date;
    const flexiDay = await DayFixed.findOne({date: date})
    if(!flexiDay){
        res.status(404);
        return res.json({message: "Day not found"})
    }
    res.status(200);
    res.json(flexiDay);
}
export const createDayEntry = async (req,res,next) => {
    const dayData = req.body;
    const dayFlexi = new DayFixed(dayData)
    await dayFlexi.save()
    res.status(201);
    res.json({message: 'Day added!'})
}
export const updateDayEntry = async (req,res,next) => {
    const date = req.query.date;
    const dayData = req.body
    const fixedDay = await DayFixed.updateOne({date: date}, dayData)
    res.status(200);
    res.json({message: `Day ${date} updated`})
}
//TODO: Add authorization token for this action
export const deleteDayEntry = async (req,res,next) => {
    const date = req.query.date;
    const deletedDay = await DayFixed.findOneAndDelete({date: date});
    if(!deletedDay){
        res.status(404);
        return res.json({message: `Assignment for the date: ${date} does not exist!`})
    }
    res.status(200);
    res.json({message: 'Day deleted! Make sure to add assignment for this day as soon as possible!'})
}
