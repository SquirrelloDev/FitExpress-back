import {Stripe} from "stripe";
import {log} from "debug";

export const processPayment = async (req,res,next) =>{
    const stripe = new Stripe(process.env.STRIPE_SK)
    const orders = req.body.orders;
    const lineItems = orders.map(order => {
        return {
            price_data:{
                currency: 'pln',
                product_data: {
                    name: order.order.name,
                    description: `Dieta o nazwie ${order.order.name}`
                },
                unit_amount: order.order.price * 100
            },
            quantity: 1
        }
    })
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: 'http://localhost:5173/cart/payment/success',
        cancel_url: 'http://localhost:5173/'
    }, {apiKey: process.env.STRIPE_SK})
    res.json({id: session.id})
}