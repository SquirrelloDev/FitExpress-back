import Promocode from '../models/promocodesModel.js'
import User from '../models/userModel.js'
import {ApiError} from "../utils/errors.js";

export const getPromocodes = async (req, res, next) => {
    try {
        const promocodes = await Promocode.find({});
        if (!promocodes) {
            return next(ApiError('could not find promocodes', 404))
        }
        res.status(200);
        res.json(promocodes)
    } catch (e) {
        next(e);
    }

}
export const getPromocodeByName = async (req, res, next) => {
    const promoName = req.params.name;
    try {
        const promocode = await Promocode.findOne({name: promoName});
        if (!promocode) {
            return next(ApiError("Promocode does not exist!", 404))
        }
        if (promocode.exp_date < new Date()) {
            return next(ApiError("Promocode expired", 404))
        }
        res.status(200);
        res.json(promocode)
    } catch (e) {
        next(e);
    }

}
export const createPromocode = async (req, res, next) => {
    const promoData = req.body;
    try {
        const existingPromocode = await Promocode.findOne({name: promoData.name});
        if (existingPromocode) {
            return next(ApiError("Promocode already exist!"), 409)
        }
        const newPromocode = new Promocode({
            name: promoData.name,
            discount: promoData.discount,
            exp_date: promoData.exp_date
        })
        const result = await newPromocode.save();
        res.status(201);
        res.json({
            message: "Promocode sucessfully added"
        })
    } catch (e) {
        next(e);
    }

}
export const updatePromoData = async (req, res, next) => {
    const id = req.params.id;
    const promoData = req.body;
    try {
        const updatedPromocode = await Promocode.findByIdAndUpdate(id, promoData);
        if (updatedPromocode) {
            res.status(200);
            res.json({
                message: "Promocode sucessfully updated!"
            })
        }
    } catch (e) {
        next(e);
    }

}
export const deletePromocode = async (req, res, next) => {
    const id = req.params.id;
    try {
        const deletedPromocode = await Promocode.findByIdAndDelete(id);
        if (deletedPromocode) {
            res.status(200);
            return res.json({
                message: 'Promocode sucessfully deleted'
            })
        }
        return next(ApiError('Promocode for deletion not found!', 404))
    } catch (e) {
        next(e);
    }

}
export const assignPromoToUser = async (req, res, next) => {
    const paymentData = req.body;
    const userId = paymentData.userId;
    const appliedPromocode = paymentData.appliedPromocode;
    //returned codes array with an _id also
    try {
        const userCodes = await User.findById(userId).select("redeemed_codes");
        const newCodes = [...userCodes.redeemed_codes, appliedPromocode];
        await User.updateOne({_id: userId}, {redeemed_codes: newCodes})
        res.status(200)
        res.json({
            message: "codes applied"
        })
    } catch (e) {
        next(e);
    }

}