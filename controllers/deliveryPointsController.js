import DeliveryPoint from '../models/deliveryPointsModel.js'
import getDistanceFromCoords from "../utils/geoDistance.js";
import {ApiError} from "../utils/errors.js";

export const getAllPoints = async (req, res) => {
    try {
        const points = await DeliveryPoint.find({});
        res.status(200);
        res.json(points);

    } catch (e) {
        next(e)
    }
}
export const getPointByCoords = async (req, res, next) => {
    const userLat = req.query.lat;
    const userLng = req.query.lng;
    let inRange = false;
    try {
        const allPoints = await DeliveryPoint.find({});
        for (const point of allPoints) {
            const distance = getDistanceFromCoords(userLat, userLng, point.lat, point.lng);
            if (distance <= point.radiusKM) {
                inRange = true;
                break;
            }
        }
        res.status(200);
        res.json({inRange: inRange})

    } catch (e) {
        next(e)
    }

}
export const getPointById = async (req, res, next) => {
    const pointId = req.params.id
    try {
        const point = await DeliveryPoint.findById(pointId);
        if (!point) {
            return next(ApiError('Delivery point does not exist!', 404))
        }
        res.status(200);
        res.json(point);

    } catch (e) {
        next(e);
    }
}
export const addPoint = async (req, res, next) => {
    const pointData = req.body
    const point = new DeliveryPoint(pointData);
    try {
        await point.save();
        res.status(201);
        res.json({message: 'point added'})

    } catch (e) {
        next(e)
    }
}
//admin only
export const updatePoint = async (req, res, next) => {
    const pointId = req.params.id
    const pointData = req.body;
    try {
        const updatedPoint = DeliveryPoint.findByIdAndUpdate(pointId, pointData)
        if (!updatedPoint) {
            return next(ApiError('Delivery point does not exist!', 404))
        }
        res.status(200);
        res.json({message: 'Point updated!'})

    } catch (e) {
        next(e)
    }
}
//admin only
export const deletePoint = async (req, res, next) => {
    const pointId = req.params.id;
    try {
        const deletedPoint = await DeliveryPoint.findByIdAndDelete(pointId);
        if (!deletedPoint) {
            return next(ApiError('Delivery point does not exist!', 404))
        }
        res.status(200);
        res.json({message: 'Point deleted!'})
    } catch (e) {
        next(e)
    }
}