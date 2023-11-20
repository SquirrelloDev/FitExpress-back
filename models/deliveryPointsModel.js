import mongoose, {Schema} from "mongoose";
const deliveryPointSchema = new Schema({
    name: {type: String, required: true},
    lat: {type: Number, required: true},
    lng: {type: Number, required: true},
    radiusKM: {type: Number, required: true}
});
export default mongoose.model('Delivery_point', deliveryPointSchema)