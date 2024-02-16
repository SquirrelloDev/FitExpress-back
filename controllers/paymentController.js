import {Stripe} from "stripe";
import {log} from "debug";
import Order from "../models/ordersModel.js";
import User from "../models/userModel.js";

export const processPayment = async (req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE_SK)
    try {
        const orders = req.body.orders;
        const ordersWithoutTokens = orders.map((order) => {
            return {
                diet_id: order.order.dietId,
                user_id: order.order.userId,
                with_weekends: order.order.withWeekends,
                calories: order.order.calories,
                price: order.order.price,
                address_id: order.order.addressId,
                name: order.order.name,
                sub_date: order.order.subDate,
                ...(order.order.flexiTier && {flexi_tier: order.order.flexiTier})
            }
        })
        const lineItems = orders.map(order => {
            return {
                price_data: {
                    currency: 'pln',
                    product_data: {
                        name: order.order.name,
                        description: `Dieta o nazwie ${order.order.name}`
                    },
                    unit_amount: order.order.price * 100
                },
                quantity: 1,
            }
        })
        const ordersObj = {}
        ordersWithoutTokens.forEach((order, idx) => {
            ordersObj[`order${idx}`] = JSON.stringify(order)
        })
        console.log(ordersObj)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:5173/cart/payment/success',
            cancel_url: 'http://localhost:5173/',
            metadata: ordersObj
        }, {apiKey: process.env.STRIPE_SK})
        res.status(200)
        res.json({id: session.id})
    } catch (e) {
        next(e)
    }
}
const endpointSec = 'whsec_ecb8b873bdc96146dc832f0b50858c87a4e66abea97adc405b23228af1d7f30c'
const createOrders = async (lineItems) => {
    const orders = Object.values(lineItems).map(item => JSON.parse(item));
    const mongoOrders = orders.map((order) => new Order(order))
    try {
        for (const mongoOrder of mongoOrders) {
            const createdOrder = await mongoOrder.save()
            await User.findByIdAndUpdate(mongoOrder.userId, {$push: {'order_ids': createdOrder._id}})
        }
    }
    catch (e){
        await Promise.reject(e)
    }
}
export const fulfill = async (req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE_SK)
    const payload = req.body;
    const sig = req.headers['stripe-signature']
    let event;
    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSec);
    } catch (e) {
        return next(e)
    }
    if (event.type === 'checkout.session.completed') {
        // Retrieve the session.
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
            event.data.object.id,
        );
        const lineItems = sessionWithLineItems.metadata;

        // Fulfill the purchase...
        try{
        await createOrders(lineItems);
        }
        catch (e) {
            return next(e)
        }
    }
    res.status(200).end()
}