import User from '../models/userModel.js'
import Address from '../models/addressesModel.js'
import Order from '../models/ordersModel.js'
import ProgressEntry from '../models/progressEntryModel.js'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import {checkPermissions, signToken} from "../utils/auth.js";
import {ApiError} from "../utils/errors.js";
import {sendRequestPasswordMail} from "../utils/mails-service.js";
import {parseIntoMidnightISO} from "../utils/dates.js";

export const getAllUsers = async (req, res, next) => {
    if (!await checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    try {
        const users = await User.find({}).skip((page - 1) * pageSize).limit(pageSize);
        if (!users) {
            return next(ApiError('Could not find the users', 404))
        }
        const totalItems = await User.find({}).countDocuments();
        res.status(200);
        res.json({
            users,
            paginationInfo: {
                totalItems,
                hasNextPage: pageSize * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / pageSize)
            }
        });
    } catch (e) {
        next(e);
    }
}
export const getUser = async (req,res,next) => {
    const id = req.params.id
    if (!await checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    try{
        const user = await User.findById(id);
        if(!user){
            return next(ApiError('User does not exist!', 404))
        }
        res.status(200)
        res.json(user);
    }
    catch (e) {
        next(e)
    }


}
export const addNewUser = async (req, res, next) => {
    const userData = req.body;
    const defaultHealthData = {
        user_height: -1,
        user_weight_current: -1,
        user_weight_planned: -1,
        age: -1,
        pal_active: -1,
        pal_passive: -1,
        user_goal: 'balance',
        bmi: -1,
    }
    try {
        const existingUser = await User.findOne({email: userData.email})
        if (existingUser) {
            return next(ApiError('User already exist!', 409));
        }
        const hashPasswd = await bcrypt.hash(userData.password, Number(process.env.BCRYPT_SALT))
        const user = new User({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            birth_date: userData.birth_date ? parseIntoMidnightISO(new Date(userData.birth_date)) : new Date("1970-01-02"),
            password: hashPasswd,
            health_data: userData.healthData ? userData.healthData : defaultHealthData,
            role: userData.role ? userData.role : process.env.ACCESS_USER
        })
        const result = await user.save();
        const token = signToken({_id: result._id, role: result.role,})
        //create document of for the new user and his entries
        const emptyProgressEntry = new ProgressEntry({
            user_id: result._id,
            weight_progress: [],
            water_progress: []
        })
        await emptyProgressEntry.save();
        res.status(201);
        res.json({
            message: 'user has been successfully created!',
            id: result._id,
            name: result.name,
            role: result.role,
            token
        })
    } catch (err) {
        return next(err);
    }


}
export const logInUser = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({email: email}).select('+password')
        if (user) {
            const isPasswdMatch = await bcrypt.compare(password, user.password)
            if (isPasswdMatch) {
                const token = signToken({_id: user._id, role: user.role,})
                res.status(200)
                return res.json({
                    message: 'loggedIn',
                    id: user._id,
                    name: user.name,
                    role: user.role,
                    ...(user.health_data.user_height < 0 && {healthDataNotFilled: true}),
                    token,
                    calories: user.health_data.calories_demand,
                    user_goal: user.health_data.user_goal
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
    if (!await checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    const userData = req.body;
    try {
        // const hashPasswd = await bcrypt.hash(userData.password, Number(process.env.BCRYPT_SALT))
        const user = await User.findByIdAndUpdate(id, userData, {returnDocument: "after"})
        res.status(200);
        res.json({
            message: "User updated!"
        })
    } catch (e) {
        next(e)
    }
}
export const updateUserHealthcard = async (req, res, next) => {
    if (!await checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const healthData = req.body.healthData
    const birthDate = req.body.birthDate;
    try {
        const user = await User.findByIdAndUpdate(req.body._id, {health_data: healthData, birth_date: birthDate})
        res.status(200);
        return res.json({
            message: 'Health card updated!'
        })
    } catch (e) {
        next(e)
    }

}
export const requestChangePassword = async (req, res, next) => {
    const reqData = req.body;
    //Firstly, check the body
    //-----------If the body has mail only---------------
    //check if user with that email exist
    try {
        const user = await User.findOne({email: reqData.email});
        if (!user) {
            return next(ApiError('User with provided email does not exist', 404))
        }
        //if exists, then generate a jwt token and send mail to reset password page with query parameter of that token, e.g. http://fitexpress.com/password-reset?token=lsd839453ld$dfn
        const token = signToken({userId: user._id}, process.env.PASSWDSECRET, {expiresIn: '10m'});
        const userWithToken = await User.findByIdAndUpdate(user._id, {"resetToken": token});
        //send mail
        await sendRequestPasswordMail(user.email, token);
        res.status(201);
        res.json({message: 'Email has been sent with reset link', token})
    } catch (e) {
        next(e);
    }
}
export const changePassword = async (req, res, next) => {
    //Firstly, verify the token
    //IF token isn't suffiecient enough (expired, malformed, etc.), return next(500)
    //If token is suffiecient,
    const reqToken = req.query.token;
    const newPasswd = req.body.password;
    let decodedToken = '';
    try {
        decodedToken = jwt.verify(reqToken, process.env.PASSWDSECRET)

    } catch (e) {
        e.statusCode = 500;
        return next(e)
    }
    const userId = decodedToken.userId;
    try {
    const user = await User.findById(userId).select("+password");
    if(!user){
        return next(ApiError('User does not exist!', 404));
    }
    //check if passwords are the same for some reason
    const passwdMatch = await bcrypt.compare(newPasswd, user.password);
    if(passwdMatch){
        return next(ApiError('New password should be different from current password', 409))
    }
    const hashedNewPasswd = await bcrypt.hash(newPasswd, Number(process.env.BCRYPT_SALT));
    const updatedPasswdUser = await User.findByIdAndUpdate(userId, {password: hashedNewPasswd, resetToken: ""});
    res.status(200);
    res.json({message: 'Password changed!'});

    }
    catch (e) {
        next(e);
    }
}
export const deleteUser = async (req, res, next) => {
    if (!await checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    try {
        const userEntry = await User.findByIdAndDelete(id)
        if (userEntry) {
            //also delete addresses, orders, etc.
            const deletedAddresses = await Address.deleteMany({user_id: id});
            const deletedOrders = await Order.deleteMany({user_id: id})
            const deletedProgressEntries = await ProgressEntry.deleteOne({user_id: id})
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