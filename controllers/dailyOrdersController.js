import DailyOrder from '../models/dailyOrdersModel.js'
import User from "../models/userModel.js";
import Order from '../models/ordersModel.js'
import Diet from '../models/dietsModel.js'
import DayFixed from '../models/fixedModel.js';
import DayFlexi from '../models/flexiModel.js'
import {isWeekend} from "../utils/dates.js";

export const getAllDailyOrders = async (req, res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const dailyOrders = await DailyOrder.find({}).skip((page - 1) * pageSize).limit(pageSize).populate({
        path: 'orders.user_id'
    })
    res.status(200);
    res.json(dailyOrders);
}
export const getDailyOrderByDate = async (req, res) => {
    const date = req.query.date
    const currentDailyDoc = await DailyOrder.findOne({date: date});
    if (!currentDailyDoc) {
        res.status(404);
        return res.json({message: "Day not found! Report this issue to the administrator immediately"})
    }
    res.status(200);
    res.json(currentDailyDoc)
}
export const addOrderToList = async (req, res) => {
    const orderData = req.body;
    //check if date timestamp is within the current day timespan
    let reqTimestamp = new Date(orderData.date).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0)
    if (reqTimestamp !== today) {
        res.status(400);
        return res.json({message: 'Incorrect date'})
    }
    const currentDailyDoc = await DailyOrder.findOne({date: orderData.date});
    if (currentDailyDoc.isAddingLocked) {
        res.status(500);
        return res.json({message: "You can't alter your choice now"})

    }
    //modifing
    const currentDailyDocOrders = currentDailyDoc.orders;
    const currentDailyOrder = currentDailyDocOrders.find(dailyOrder => (dailyOrder.order_id).toString() === orderData.orderId);
    console.log(currentDailyOrder)
    const updateObj = {
        user_id: orderData.userId,
        diet_id: orderData.dietId,
        order_id: orderData.orderId,
        selected_meals: orderData.selectedMeals
    }
    let resMsg = {
        message: 'Entry added'
    }
    //modifing
    if (currentDailyOrder) {
        await DailyOrder.updateOne({
            date: orderData.date,
            "orders.order_id": orderData.orderId
        }, {$set: {"orders.$": updateObj}})
        res.status(200);
        resMsg.message = 'Entry updated!';
    } else {
        await DailyOrder.updateOne({date: orderData.date}, {$push: {"orders": updateObj}})
        res.status(201);
    }
    //adding
    res.json(resMsg)

}

//TODO:node-cron also here
export const lockAddingOrders = async () => {
    const currentDate = new Date().setHours(23, 0, 0, 0);
    const currentDateISO = new Date(currentDate).toISOString();
    console.log(currentDateISO)
    const dailyEntry = await DailyOrder.findOne({date: currentDateISO});
    const users = await User.find({});
    const orders = dailyEntry.orders;
    const plainUserIdsArr = users.map(userId => userId._id);
    //TODO:turn 'locked' flag to true
    await DailyOrder.findOneAndUpdate({date: currentDateISO}, {isAddingLocked: true});

    for (const userId of plainUserIdsArr) {
        //to z kolekcji daily orders
        const existingORDERS = orders.map(order => {
            if ((order.user_id).toString() === userId.toString()) {
                return (order.order_id).toString();
            }
        }).filter(item => item !== undefined);
        //to z kolekcji users
        const allOrdersForCurrentUser = users.find(user => user._id === userId).order_ids
        //wyfiltruj te ordery, znajdują się w EXISTING ORDERS (w ten sposób zostaną niedodane ordery przez użytkowników)
        const ordersToAdd = allOrdersForCurrentUser.filter(existingOrder => {
            if (!existingORDERS.includes(existingOrder.toString())) {
                return existingOrder
            }
        })
        if (ordersToAdd.length === 0) {
            continue;
        }

        //sprawdź które z brakujących orderów są aktywne poprzez datę. Jeśli mieszczą się w dacie to oznacza że dany order jest AKTYWNY!
        for (const orderToAdd of ordersToAdd) {
            const orderFromCollection = await Order.findById(orderToAdd._id);
            if (((orderFromCollection.sub_date.from).getTime() > currentDate || currentDate > (orderFromCollection.sub_date.to).getTime())) {
                console.log(`Order ${orderToAdd} is inactive. Moving to next order`);
                continue;
            }
            if(isWeekend(currentDate) === orderFromCollection.with_weekends){
                console.log(`Order ${orderToAdd} is inactive. Moving to next order`);
                continue;
            }
            const associatedDiet = await Diet.findById(orderFromCollection.diet_id);
            if (associatedDiet.diet_type === 'Fixed') {
                const diet = await DayFixed.findOne({date: currentDateISO})
                console.log(diet)
                console.log(orderFromCollection.diet_id)
                let dietMeals = (diet.diets.find(diet => (diet.diet_id).toString() === (orderFromCollection.diet_id).toString())).meals
                console.log(dietMeals)
                const fixedDietMeals = Object.values(dietMeals).slice(0, 5)
                const updateObj = {
                    user_id: userId,
                    diet_id: orderFromCollection.diet_id,
                    order_id: orderFromCollection._id,
                    selected_meals: fixedDietMeals,
                };
                await DailyOrder.updateOne({date: currentDateISO}, {$push: {"orders": updateObj}});
            } else if (associatedDiet.diet_type === 'Flexi') {
                const flexiDay = await DayFlexi.findOne({date: currentDateISO});
                if (flexiDay) {
                    const selectedMeals = [
                        flexiDay.morning_meals[0].toString(),
                        flexiDay.lunch_meals[0].toString(),
                        flexiDay.dinner_meals[0].toString(),
                        flexiDay.teatime_meals[0].toString(),
                        flexiDay.supper_meals[0].toString(),
                    ];
                    const updateObj = {
                        user_id: userId,
                        diet_id: orderFromCollection.diet_id,
                        order_id: orderFromCollection._id,
                        selected_meals: selectedMeals,
                    };
                    await DailyOrder.updateOne({date: currentDateISO}, {$push: {"orders": updateObj}});
                }
            }
        }
    }
}
//TODO:node-cron here
export const initDay = async (req, res) => {
    const newDay = new DailyOrder({
        date: new Date().setHours(23, 0, 0, 0),
        orders: []
    })
    await newDay.save()
    res.json({message: 'New day created!'})
}