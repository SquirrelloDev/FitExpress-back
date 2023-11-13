import mongoose from "mongoose";
const webpushSchema = new mongoose.Schema({
    endpoint: {type: String, required: true},
    expirationTime: {type: Number},
    keys: {
        p256dh: {type: String},
        auth: {type: String},
        required: true
    }
})
export default mongoose.model('webpushSubscriptions', webpushSchema)