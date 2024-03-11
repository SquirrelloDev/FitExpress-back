import {Stripe} from "stripe";
import {log} from "debug";
import Order from "../models/ordersModel.js";
import User from "../models/userModel.js";
import {parseIntoMidnightISO} from "../utils/dates.js";

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
                sub_date: {
                    from: parseIntoMidnightISO(order.order.subDate.from),
                    to: parseIntoMidnightISO(order.order.subDate.to),
                },
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
            cancel_url: 'http://localhost:5173/cart',
            metadata: {...ordersObj, appliedPromocode: req.body.appliedPromocode}
        }, {apiKey: process.env.STRIPE_SK})
        res.status(200)
        res.json({id: session.id})
    } catch (e) {
        next(e)
    }
}
// TODO: Change webhook secret on prod
const createOrders = async (metaOrders, appliedPromocode) => {
    const orders = Object.values(metaOrders).map(item => JSON.parse(item));
    const userId = orders[0].user_id
    const mongoOrders = orders.map((order) => new Order({...order, is_active: true}))
    try {
        for (const mongoOrder of mongoOrders) {
            const createdOrder = await mongoOrder.save()
            await User.findByIdAndUpdate(mongoOrder.user_id, {$push: {'order_ids': createdOrder._id}})
        }
        if (appliedPromocode !== '') {
            const userCodes = await User.findById(userId).select("redeemed_codes");
            const newCodes = [...userCodes.redeemed_codes, appliedPromocode];
            await User.updateOne({_id: userId}, {redeemed_codes: newCodes})
        }
    } catch (e) {
        await Promise.reject(e)
    }
}
export const fulfill = async (req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE_SK)
    const payload = req.body;
    const sig = req.headers['stripe-signature']
    let event;
    try {
        event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK);
    } catch (e) {
        return next(e)
    }
    if (event.type === 'checkout.session.completed') {
        // Retrieve the session.
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
            event.data.object.id,
        );
        const lineItems = sessionWithLineItems.metadata;
        const {['appliedPromocode']: promocodeId, ...onlyOrders} = lineItems
        // Fulfill the purchase...
        try {
            await createOrders(onlyOrders, promocodeId);
        } catch (e) {
            return next(e)
        }
    }
    res.status(200).end()
}