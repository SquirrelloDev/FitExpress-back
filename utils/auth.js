import crypto from "crypto";
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
const genSecret = () => {
  return crypto.randomBytes(32).toString('hex')
}
export const signToken = (data, secretKey = process.env.JSECRET, options = {expiresIn: "1h"}) => {
  return jwt.sign(data, secretKey, options);
}
export const checkPermissions = async (userInfo, minAccLvl) => {
  const existingUser = await User.findById(userInfo._id)
  return (existingUser && userInfo.role >= minAccLvl);
}