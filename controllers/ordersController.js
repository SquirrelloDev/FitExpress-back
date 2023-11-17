import Order from '../models/ordersModel.js';
import User from '../models/userModel.js';
export const getAllOrders = async (req, res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const orders = await Order.find({}).skip((page - 1) * pageSize).limit(pageSize).populate('diet_id').populate('user_id');
    res.status(200);
    res.json(orders)
}
export const getUserOrders = async (req, res) => {
    const userId = req.query.userId;
    const userOrders = await Order.find({user_id: userId}).populate('diet_id').select('-user_id');
    if (!userOrders) {
        res.status(404);
        return res.json({message: "User with a given id doesn't have any order"})
    }
    res.status(200);
    res.json(userOrders);
}
export const getOrdersByDiet = async (req, res) => {
    const dietId = req.query.dietId;
    const dietOrders = await Order.find({diet_id: dietId}).populate('user_id').select('-diet_id');
    if (!dietOrders) {
      res.status(404);
      return res.json({message: "There are no orders for the given diet"})
    }
    res.status(200);
    res.json(dietOrders);
}
export const getOrderById = async (req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id).populate("diet_id").populate("user_id");
    if (!order) {
        res.status(404);
        return res.json({message: "Order does not exist!"})
    }
    res.status(200);
    res.json(order)

}
export const createOrder = async (req, res) => {
    const orderData = req.body
    const order = new Order({
        diet_id: orderData.dietId,
        user_id: orderData.userId,
        price: orderData.price,
        sub_date: orderData.subDate,
        with_weekends: orderData.withWeekends,
    });
    const createdOrder = await order.save();
    await User.findByIdAndUpdate(orderData.userId, {$push: {'order_ids': createdOrder._id}})
    res.status(201);
    res.json({message: 'Order created'})

}
export const updateOrder = async (req, res) => {
    const id = req.params.id;
    const orderData = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(id, {
        diet_id: orderData.dietId,
        user_id: orderData.userId,
        price: orderData.price,
        sub_date: orderData.subDate,
        with_weekends: orderData.withWeekends
    })
    if(!updatedOrder){
        res.status(404);
        return res.json({message: 'Order does not exist!'})
    }
    res.status(200);
    res.json({message: "Order updated!"})
}
export const deleteOrder = async (req, res) => {
    const id = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if(!deletedOrder) {
        res.status(404);
        return res.json({message: 'Order does not exist!'})
    }
    await User.updateOne({_id: deletedOrder.user_id}, {$pull: {"order_ids": id}});
    res.status(200);
    res.json({message: "Order sucessfully deleted!"})
}
