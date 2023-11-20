import User from '../models/userModel.js'
import Address from '../models/addressesModel.js'
import Order from '../models/ordersModel.js'
import ProgressEntry from '../models/progressEntryModel.js'
import crypto from "crypto"
import bcrypt from "bcrypt"

export const getAllUsers = async (req, res, next) => {
    try{
        const users = await User.find({});
        console.log(users)
        if (!users) {
            res.status(500)
            return res.json({
                message: 'Could not find the users'
            })
        }
        res.status(200);
        res.json(users);
    }
    catch (e) {
        
    }
}
export const addNewUser = async (req, res, next) => {
    const userData = req.body;
    try{
        const existingUser = await User.findOne({email: userData.email})
        if (existingUser) {
            res.status(500);
            return res.json({
                message: "user already exists!"
            })

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
    }
    catch (e) {
        
    }
    res.status(201);
    res.json({
        message: 'user has been successfully created!'
    })

}
export const logInUser = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
        const user = await User.findOne({email: email})
        if (user) {
            const isPasswdMatch = await bcrypt.compare(password, user.password)
            if (isPasswdMatch) {
                res.status(200)
                return res.json({
                    //return a JWT token
                    message: 'loggedIn'
                })
            }
            res.status(401);
            return res.json({
                message: "Passwords do not match"
            })
        }
        res.status(404);
        res.json({
            message: "User does not exist!"
        })
    } catch (e) {

    }

}
export const updateUserData = async (req,res,next) =>{
    const id = req.params.id;
    console.log(id)
    const userData = req.body;
    try{
        const user = await User.findByIdAndUpdate(id, userData, {returnDocument: "after"})
        console.log(user)
        res.status(200);
        res.json({
            message: "User updated!"
        })
    } catch (e){

    }
}
export const updateUserHealthcard = async (req,res,next) => {
    const healthData = req.body.healthData
    try{
        const user = await User.findByIdAndUpdate(req.body._id, { health_data: healthData }, {returnDocument: "after"})
        console.log(user)
        res.status(200);
        return res.json({
            message: 'loggedIn'
        })
    } catch (e) {

    }

}
export const deleteUser = async(req, res, next) =>  {
    const id = req.params.id;
    try{
        const userEntry = await User.findByIdAndDelete(id)
        if(userEntry){
        //also delete addresses, orders, etc.
            const deletedAddresses = await Address.deleteMany({user_id: id});
            const deletedOrders = await Order.deleteMany({user_id: id})
            res.status(200);
            return res.json({
                message: 'User successfully deleted'
            })
        }
        res.status(404);
        res.json({
            message: 'User for deletion not found!'
        })

    }
    catch (e) {
        console.error('Something happened ' + e)
        res.status(500);
        res.json({
            message: "Something happened on a server"
        })
    }

}