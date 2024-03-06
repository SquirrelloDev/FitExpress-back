import mongoose, {Schema} from "mongoose";

const webpushModel = new Schema({
    endpoint: {type: String, required: true},
    expirationTime: {type: Number},
    keys: {
        p256dh: {type: String, required: true},
        auth: {type: String, required: true}
    }
})
export default mongoose.model('Webpush', webpushModel)