import Webpush from '../models/webpushModel.js'
import webpush from 'web-push'
import {sendNotification} from "../utils/pushMessage.js";
import {checkPermissions} from "../utils/auth.js";
import {ApiError} from "../utils/errors.js";
export const addSubscription = async (req, res, next) => {
    if(!await checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const newSub = new Webpush(req.body)
    await newSub.save()
    res.status(201).json({message: 'push created!'})
}
export const removeSubscription = async (req,res,next) => {
    if(!await checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const sub = await Webpush.findOneAndDelete({endpoint: req.body.endpoint})
    res.status(200).json({message: 'sub removed'})
}
export const notifyAll = async (req,res,next) => {
    const payload = JSON.stringify({
        title: 'Powiadomienie o posiłku',
        options: {
            body: 'Powiadomienie z serwera'
        }
    })
    const allSubs = await Webpush.find({});
    sendNotification(allSubs, payload)

    res.status(200).json({message: 'Push sent!'})
}