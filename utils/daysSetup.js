import DailyOrder from "../models/dailyOrdersModel.js";
import Meals from "../models/mealsModel.js";
import DayFlexi from "../models/flexiModel.js";
import Diet from "../models/dietsModel.js";
import DayFixed from "../models/fixedModel.js";
import {getNextDayMidnight} from "./dates.js";

export const initDay = async () => {
    try {
        const newestDocument = await DailyOrder
        .findOne()
        .sort({ date: -1 }) // Sort in descending order to get the newest date first
        .limit(1); // Limit the result to just one document
        const nextDate = getNextDayMidnight(newestDocument.date)
        const newDay = new DailyOrder({
            date: nextDate,
            orders: []
        })
        await newDay.save()
        //flexi
        const existingFlexiDay = await DayFlexi.findOne({date: nextDate});
            const flexiMeals = await Meals.find({}).limit(30);
        if (!existingFlexiDay) {
            let globalFlexiIndex = 0;
            const flexiMorningArr = []
            const flexiLunchArr = []
            const flexiDinnerArr = []
            const flexiTeatimeArr = []
            const flexiSupperArr = []
            for (globalFlexiIndex; globalFlexiIndex < 6; globalFlexiIndex++) {
                flexiMorningArr.push(flexiMeals[globalFlexiIndex]._id)
            }
            for (globalFlexiIndex; globalFlexiIndex < 12; globalFlexiIndex++) {
                flexiLunchArr.push(flexiMeals[globalFlexiIndex]._id)
            }
            for (globalFlexiIndex; globalFlexiIndex < 18; globalFlexiIndex++) {
                flexiDinnerArr.push(flexiMeals[globalFlexiIndex]._id)
            }
            for (globalFlexiIndex; globalFlexiIndex < 24; globalFlexiIndex++) {
                flexiTeatimeArr.push(flexiMeals[globalFlexiIndex]._id)
            }
            for (globalFlexiIndex; globalFlexiIndex < 30; globalFlexiIndex++) {
                flexiSupperArr.push(flexiMeals[globalFlexiIndex]._id)
            }

            const flexiObj = new DayFlexi({
                date: nextDate,
                morning_meals: flexiMorningArr,
                lunch_meals: flexiLunchArr,
                dinner_meals: flexiDinnerArr,
                teatime_meals: flexiTeatimeArr,
                supper_meals: flexiSupperArr
            })
            await flexiObj.save()
        }
        //fixed
        const existingFixedDay = await DayFixed.findOne({date: nextDate})
        if (!existingFixedDay) {
            const diets = await Diet.find({});
            const fixedDietsIds = diets.filter(diet => diet.diet_type !== 'Flexi').map(fixedDiet => fixedDiet._id);
            const dietsArr = fixedDietsIds.map(dietId => {
                return {
                    diet_id: dietId,
                    meals: {
                        morning: flexiMeals[Math.floor(Math.random() * 30)]._id,
                        lunch: flexiMeals[Math.floor(Math.random() * 30)]._id,
                        dinner: flexiMeals[Math.floor(Math.random() * 30)]._id,
                        teatime: flexiMeals[Math.floor(Math.random() * 30)]._id,
                        supper: flexiMeals[Math.floor(Math.random() * 30)]._id,
                    }
                }
            });
            const fixedDietDocument = new DayFixed({
                date: nextDate,
                diets: dietsArr
            })
            await fixedDietDocument.save();
        }
    } catch (e) {
        console.error('INIT DAY ERROR', e)
    }

}