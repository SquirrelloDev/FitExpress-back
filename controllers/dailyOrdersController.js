import DailyOrder from '../models/dailyOrdersModel.js'
import User from "../models/userModel.js";
import Order from '../models/ordersModel.js'
import Diet from '../models/dietsModel.js'
import DayFixed from '../models/fixedModel.js';
import DayFlexi from '../models/flexiModel.js'
import {isWeekend} from "../utils/dates.js";
import {ApiError} from "../utils/errors.js";
import {checkPermissions} from "../utils/auth.js";

export const getAllDailyOrders = async (req, res, next) => {
    if(!await checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    try {
        const dailyOrders = await DailyOrder.find({}).skip((page - 1) * pageSize).limit(pageSize).populate({
            path: 'orders.user_id'
        })
        const totalItems = await DailyOrder.find({}).countDocuments()
        res.status(200);
        res.json({
            dailyOrders,
            paginationInfo: {
                totalItems,
                hasNextPage: pageSize * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems/pageSize)
            }
        });

    } catch (e) {
        next(e)
    }
}
export const getDailyOrderByDate = async (req, res, next) => {
    if(!await checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const date = req.query.date
    try {
        const currentDailyDoc = await DailyOrder.findOne({date: date}).populate({
            path: 'orders',
            populate: {
                path:'user_id'
            }
        }).
        populate({
            path: 'orders',
            populate: {
                path: 'diet_id'
            }
        }).
        populate({
            path: 'orders',
            populate: {
                path: 'order_id'
            }
        }).
        populate({
            path: 'orders',
            populate: {
                path: 'selected_meals'
            }
        })
            .populate({
            path: 'orders',
            populate: {
                path: 'order_id',
                populate: {
                    path: 'address_id'
                }
            }
        });
        if (!currentDailyDoc) {
            return next(ApiError('Day not found! Report this issue to the administrator immediately', 404))
        }
        res.status(200);
        res.json(currentDailyDoc)

    } catch (e) {
        next(e);
    }
}
export const addOrderToList = async (req, res, next) => {
    if(!await checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const orderData = req.body;
    //check if date timestamp is within the current day timespan

    let reqTimestamp = new Date(orderData.date).setHours(1, 0, 0, 0);
    const today = new Date().setHours(1, 0, 0, 0)
    if (reqTimestamp === today) {
        return next(ApiError('Incorrect date', 400))
    }
    try {
        const currentDailyDoc = await DailyOrder.findOne({date: new Date(today).toISOString()});
        if (currentDailyDoc.isAddingLocked) {
            return next(ApiError("You can't alter your choice now"));
        }
        //modifing
        const currentDailyDocOrders = currentDailyDoc.orders;
        const currentDailyOrder = currentDailyDocOrders.find(dailyOrder => (dailyOrder.order_id).toString() === orderData.orderId);
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
            let updateArr = currentDailyDocOrders;
            const currentDailyOrderIdx = currentDailyDocOrders.findIndex(dailyOrder => (dailyOrder.order_id).toString() === orderData.orderId)
            updateArr[currentDailyOrderIdx] = updateObj
            await DailyOrder.updateOne({
                date: orderData.date
                // "orders.order_id": orderData.orderId
            }, {$set: {"orders": updateArr}})
            res.status(200);
            resMsg.message = 'Entry updated!';
        } else {
            //adding
            await DailyOrder.updateOne({date: orderData.date}, {$push: {"orders": updateObj}})
            res.status(201);
        }
        res.json(resMsg)

    } catch (e) {
        next(e);
    }

}

export const lockAddingOrders = async () => {
    const currentDate = new Date().setHours(1, 0, 0, 0);
    const currentDateISO = new Date(currentDate).toISOString();
    try{
        const dailyEntry = await DailyOrder.findOne({date: currentDateISO});
        const users = await User.find({});
        const orders = dailyEntry.orders;
        const plainUserIdsArr = users.map(userId => userId._id);
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
            //sprawdź które z brakujących orderów są aktywne poprzez datę oraz te, które mają ustawiony adres. Jeśli mieszczą się w dacie to oznacza że dany order jest AKTYWNY!
            for (const orderToAdd of ordersToAdd) {
                const orderFromCollection = await Order.findById(orderToAdd.toString());
                if (((orderFromCollection.sub_date.from).getTime() > currentDate || currentDate > (orderFromCollection.sub_date.to).getTime()) || !orderFromCollection.address_id) {
                    console.log(`Order ${orderToAdd} is inactive. Moving to next order`);
                    continue;
                }
                if (isWeekend(currentDate) && !orderFromCollection.with_weekends) {
                    console.log(`Order ${orderToAdd} is inactive. Moving to next order`);
                    continue;
                }
                const associatedDiet = await Diet.findById(orderFromCollection.diet_id);
                if (associatedDiet.diet_type === 'Fixed') {
                    const diet = await DayFixed.findOne({date: currentDateISO})
                    let dietMeals = (diet.diets.find(diet => (diet.diet_id).toString() === (orderFromCollection.diet_id).toString())).meals
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
    catch (e) {
        console.error(e);
    }

}