import crypto from "crypto";
import jwt from 'jsonwebtoken'
const genSecret = () => {
  return crypto.randomBytes(32).toString('hex')
}
export const signToken = (data, secretKey = process.env.JSECRET, options = {expiresIn: "1h"}) => {
  return jwt.sign(data, secretKey, options);
}
export const checkPermissions = (userInfo, minAccLvl) => {
  return userInfo.role >= minAccLvl;
}