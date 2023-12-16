import Order from '../models/ordersModel.js';
import User from '../models/userModel.js';
import {ApiError} from "../utils/errors.js";
import {checkPermissions} from "../utils/auth.js";
export const getAllOrders = async (req, res,next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    try{
        const orders = await Order.find({}).skip((page - 1) * pageSize).limit(pageSize).populate('diet_id').populate('user_id');
        const totalItems = await Order.find({}).countDocuments()
        res.status(200);
        res.json({
            orders,
            paginationInfo: {
                totalItems,
                hasNextPage: pageSize * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems/pageSize)
            }
        })
    }
    catch (e) {
        next(e)
    }

}
export const getUserOrders = async (req, res,next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const userId = req.query.userId;
    try{
        const userOrders = await Order.find({user_id: userId}).populate('diet_id').select('-user_id');
        if (!userOrders) {
            return next(ApiError("User with a given id doesn't have any order"), 404)
        }
        res.status(200);
        res.json(userOrders);
    }
    catch (e) {
        next(e);
    }

}
export const getOrdersByDiet = async (req, res,next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const dietId = req.query.dietId;
    try {
        const dietOrders = await Order.find({diet_id: dietId}).populate('user_id').select('-diet_id');
        if (!dietOrders) {
            return next(ApiError("There are no orders for the given diet", 404))
        }
        res.status(200);
        res.json(dietOrders);
    }
    catch (e) {
        next(e);
    }

}
export const getOrderById = async (req, res,next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    try{
        const order = await Order.findById(id).populate("diet_id").populate("user_id");
        if (!order) {
            return next(ApiError("Order does not exist!", 404))
        }
        res.status(200);
        res.json(order)
    }
    catch (e) {
        next(e);
    }


}
export const createOrder = async (req, res,next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const orderData = req.body
    const order = new Order({
        diet_id: orderData.dietId,
        user_id: orderData.userId,
        price: orderData.price,
        sub_date: orderData.subDate,
        with_weekends: orderData.withWeekends,
        calories: orderData.calories,
        ...(orderData.flexiTier && {flexi_tier: orderData.flexiTier})
    });
    try{
        const createdOrder = await order.save();
        await User.findByIdAndUpdate(orderData.userId, {$push: {'order_ids': createdOrder._id}})
        res.status(201);
        res.json({message: 'Order created'})
    }
    catch (e) {
        next(e);
    }


}
export const updateOrder = async (req, res,next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    const orderData = req.body;
    try{
        const updatedOrder = await Order.findByIdAndUpdate(id, {
            diet_id: orderData.dietId,
            user_id: orderData.userId,
            price: orderData.price,
            sub_date: orderData.subDate,
            with_weekends: orderData.withWeekends,
            calories: orderData.calories,
            ...(orderData.flexiTier && {flexi_tier: orderData.flexiTier})
        })
        if(!updatedOrder){
            return next(ApiError('Order does not exist!'),404)
        }
        res.status(200);
        res.json({message: "Order updated!"})
    }
    catch (e) {
        next(e);
    }

}
export const deleteOrder = async (req, res,next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    try{
        const deletedOrder = await Order.findByIdAndDelete(id);
        if(!deletedOrder) {
            return next(ApiError('Order does not exist!',404))
        }
        await User.updateOne({_id: deletedOrder.user_id}, {$pull: {"order_ids": id}});
        res.status(200);
        res.json({message: "Order sucessfully deleted!"})
    }
    catch (e) {
        next(e)
    }

}
