import User from '../models/userModel.js'
import Address from '../models/addressesModel.js'
import Order from '../models/ordersModel.js'
import ProgressEntry from '../models/progressEntryModel.js'
import bcrypt from "bcrypt"
import {signToken} from "../utils/auth.js";
import {ApiError} from "../utils/errors.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        if (!users) {
            return next(ApiError('Could not find the users', 404))
        }
        res.status(200);
        res.json(users);
    } catch (e) {
        next(e);
    }
}
export const addNewUser = async (req, res, next) => {
    const userData = req.body;
    try {
        const existingUser = await User.findOne({email: userData.email})
        if (existingUser) {
            return next(ApiError('User already exist!', 409));
        }
        const hashPasswd = await bcrypt.hash(userData.password, 12)
        const user = new User({
            name: userData.name,
            email: userData.email,
            birth_date: userData.birth_date,
            password: hashPasswd,
            health_data: userData.healthData,
        })
        const result = await user.save();
        //create document of for the new user of his entries
        const emptyProgressEntry = new ProgressEntry({
            user_id: result._id,
            weight_progress: [],
            water_progress: []
        })
        await emptyProgressEntry.save();
    } catch (err) {
        return next(err);
    }
    res.status(201);
    res.json({
        message: 'user has been successfully created!'
    })

}
export const logInUser = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({email: email}).select('+password')
        if (user) {
            const isPasswdMatch = await bcrypt.compare(password, user.password)
            if (isPasswdMatch) {
                const token = signToken({...user._doc})
                res.status(200)
                return res.json({
                    message: 'loggedIn',
                    token
                })
            }
            return next(ApiError('Passwords do not match', 401))
        }
        return next(ApiError('User does not exist!', 404));

    } catch (e) {
        next(e);
    }


}
export const updateUserData = async (req, res, next) => {
    const id = req.params.id;
    const userData = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, userData, {returnDocument: "after"})
        console.log(user)
        res.status(200);
        res.json({
            message: "User updated!"
        })
    } catch (e) {
        next(e)
    }
}
export const updateUserHealthcard = async (req, res, next) => {
    const healthData = req.body.healthData
    try {
        const user = await User.findByIdAndUpdate(req.body._id, {health_data: healthData}, {returnDocument: "after"})
        console.log(user)
        res.status(200);
        return res.json({
            message: 'loggedIn'
        })
    } catch (e) {
    next(e)
    }

}
export const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    try {
        const userEntry = await User.findByIdAndDelete(id)
        if (userEntry) {
            //also delete addresses, orders, etc.
            const deletedAddresses = await Address.deleteMany({user_id: id});
            const deletedOrders = await Order.deleteMany({user_id: id})
            res.status(200);
            return res.json({
                message: 'User successfully deleted'
            })
        }
        return next(ApiError('User for deletion not found!', 404))

    } catch (e) {
        next(e)
    }

}