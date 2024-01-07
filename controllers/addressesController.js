import Address from '../models/addressesModel.js'
import User from '../models/userModel.js'
import Order from '../models/ordersModel.js'
import {ApiError} from "../utils/errors.js";
import {checkPermissions} from "../utils/auth.js";

export const getAddresses = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    try {
        const addresses = await Address.find({}).populate('user_id').populate('linked_points').skip((page - 1) * pageSize).limit(pageSize)
        const totalItems = await Address.find({}).countDocuments();
        res.status(200);
        res.json({
            addresses,
            paginationInfo: {
                totalItems,
                hasNextPage: pageSize * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / pageSize)
            }
        })

    } catch (e) {
        next(e)
    }
}
export const getAddressById = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const addressId = req.params.id;
    try {
        const address = await Address.findById(addressId).populate("user_id").populate('linked_points');
        if (!address) {
            return next(ApiError('Address not found', 404))
        }
        res.status(200)
        res.json(address)
    } catch (e) {
        next(e)
    }
}
export const getUserAddresses = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const userId = req.params.id;
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    try {
        const addresses = await Address.find({user_id: userId}).skip((page - 1) * pageSize).limit(pageSize);
        const totalItems = await Address.find({user_id: userId}).countDocuments();
        res.status(200);
        res.json({
            addresses,
            paginationInfo: {
                totalItems,
                hasNextPage: pageSize * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / pageSize)
            }
        })
    } catch (e) {
        next(e)
    }
}
export const addAddress = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }

    const addressData = req.body.address;
    const userId = req.body.userId;
    console.log(userId)
    const newAddress = new Address({
        street: addressData.street,
        city: addressData.city,
        postal: addressData.postal,
        building_no: addressData.buildingNumber,
        apartment_no: addressData.apartmentNumber,
        voivodeship: addressData.voivodeship,
        extra_info: addressData.extraInfo,
        is_weekend: addressData.isWeekend,
        is_default: addressData.isDefault,
        linked_points: addressData.linked_points,
        user_id: userId
    });
    try {
        const returnAddress = await newAddress.save()
        const user = await User.findById(userId).select('addresses');
        console.log(user)
        const userAddresses = user.addresses
        const newAddresses = [...userAddresses, returnAddress._id]
        await User.updateOne({_id: userId}, {addresses: newAddresses})
        res.status(201);
        res.json({
            message: 'Address added sucessfully!',
            statusCode: 201,
            payload: newAddress
        })

    } catch (e) {
        next(e)
    }
}
export const updateAddress = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const addressId = req.params.id;
    const addressData = { ...req.body.address, userId: req.body.userId }
    console.log(addressData)
    try {
        const updatedAddress = await Address.findByIdAndUpdate(addressId, addressData, {returnDocument: "after"})
        res.status(200)
        res.json({
            message: "Address updated succesfully",
            payload: updatedAddress
        })

    } catch (e) {
        next(e);
    }
}
export const deleteAddress = async (req, res, next) => {
    if (!checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    try {
        const deletedAddres = await Address.findByIdAndDelete(id);
        if (deletedAddres) {
            const user = await User.findById(deletedAddres.user_id).select('addresses')
            const userAddresses = user.addresses
            const updatedAddresses = userAddresses.filter(addressId => addressId.toString() !== id)
            await User.updateOne({_id: user._id}, {addresses: updatedAddresses})
            await Order.updateMany({address_id: id}, {address_id: ''});
            res.status(200);
            return res.json({
                message: "Address deleted sucessfully!",
                payload: deletedAddres
            })
        }
        return next(ApiError('Address for deletion not found!', 404))
    } catch (e) {
        next(e)
    }
}