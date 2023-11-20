import DeliveryPoint from '../models/deliveryPointsModel.js'
import getDistanceFromCoords from "../utils/geoDistance.js";

export const getAllPoints = async (req, res) => {
    const points = await DeliveryPoint.find({});
    res.status(200);
    res.json(points);
}
export const getPointByCoords = async (req, res) => {
    const userLat = req.query.lat;
    const userLng = req.query.lng;
    let inRange = false;
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

}
export const getPointById = async (req, res) => {
    const pointId = req.params.id
    const point = await DeliveryPoint.findById(pointId);
    if (!point) {
        res.status(404);
        return res.json({message: 'Delivery point does not exist!'})
    }
    res.status(200);
    res.json(point);
}
export const addPoint = async (req, res) => {
    const pointData = req.body
    const point = new DeliveryPoint(pointData);
    await point.save();
    res.status(201);
    res.json({message: 'point added'})
}
//admin only
export const updatePoint = async (req, res) => {
    const pointId = req.params.id
    const pointData = req.body;
    const updatedPoint = DeliveryPoint.findByIdAndUpdate(pointId, pointData)
    if (!updatedPoint) {
        res.status(404);
        return res.json({message: 'Delivery point does not exist!'})
    }
    res.status(200);
    res.json({message: 'Point updated!'})
}
//admin only
export const deletePoint = async (req, res) => {
    const pointId = req.params.id;
    const deletedPoint = await DeliveryPoint.findByIdAndDelete(pointId);
    if (!deletedPoint) {
        res.status(404);
        return res.json({message: 'Delivery point does not exist!'})
    }
    res.status(200);
    res.json({message: 'Point deleted!'})
}