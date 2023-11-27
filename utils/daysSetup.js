import DailyOrder from "../models/dailyOrdersModel.js";
import Meals from "../models/mealsModel.js";
import DayFlexi from "../models/flexiModel.js";
import Diet from "../models/dietsModel.js";
import DayFixed from "../models/fixedModel.js";
import {getNextDayMidnight} from "./dates.js";

export const initDay = async () => {
    const newDay = new DailyOrder({
        date: getNextDayMidnight(),
        orders: []
    })
    try{
        await newDay.save()
        //flexi
        const flexiMeals = await Meals.find({}).limit(30);
        console.log(flexiMeals)
        const flexiMorningArr = flexiMeals.map((meal, idx) => {
            if (idx <= 5) {
                return meal._id
            }
        })
        const flexiLunchArr = flexiMeals.map((meal, idx) => {
            if (idx > 5 && idx <= 11) {
                return meal._id
            }
        })
        const flexiDinnerArr = flexiMeals.map((meal, idx) => {
            if (idx > 11 && idx <= 16) {
                return meal._id
            }
        })
        const flexiTeatimeArr = flexiMeals.map((meal, idx) => {
            if (idx > 16 && idx <= 23) {
                return meal._id
            }
        })
        const flexiSupperArr = flexiMeals.map((meal, idx) => {
            if (idx > 23 && idx <= 29) {
                return meal._id
            }
        })

        const flexiObj = new DayFlexi({
            date: getNextDayMidnight(),
            morning_meals: flexiMorningArr,
            lunch_meals: flexiLunchArr,
            dinner_meals: flexiDinnerArr,
            teatime_meals: flexiTeatimeArr,
            supper_meals: flexiSupperArr
        })
        await flexiObj.save()
        //fixed
        const diets = await Diet.find({});
        const fixedDietsIds = diets.filter(diet => diet.diet_type !== 'Flexi').map(fixedDiet => fixedDiet._id);
        const dietsArr = fixedDietsIds.map(dietId => {
            return {
                diet_id: dietId,
                meals: {
                    morning: flexiMeals[0],
                    lunch: flexiMeals[0],
                    dinner: flexiMeals[0],
                    teatime: flexiMeals[0],
                    supper: flexiMeals[0],
                }
            }
        });
        const fixedDietDocument = new DayFixed({
            date: getNextDayMidnight(),
            diets: dietsArr
        })
        await fixedDietDocument.save();
    }
    catch (e) {
        console.error('INIT DAY ERROR', e)
    }

}