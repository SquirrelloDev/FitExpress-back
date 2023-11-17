import mongoose, {Schema} from "mongoose";
const orderSchema = new mongoose.Schema({
    diet_id: {type: Schema.Types.ObjectId, required: true, ref: 'Diet'},
    user_id: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    price: {type: Number, required: true},
    sub_date: {
        from: {type: Schema.Types.Date, required: true},
        to: {type: Schema.Types.Date, required: true},
    },
    with_weekends: {type: Boolean, required: true, default: false}
})
export default mongoose.model('Order', orderSchema)