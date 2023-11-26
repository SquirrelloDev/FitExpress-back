import crypto from "crypto";
import jwt from 'jsonwebtoken'
const genSecret = () => {
  return crypto.randomBytes(32).toString('hex')
}
export const signToken = (data, options = {expiresIn: "1h"}) => {
  return jwt.sign(data, process.env.JSECRET, options);
}