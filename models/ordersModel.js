import mongoose, {Schema} from "mongoose";
const orderSchema = new mongoose.Schema({
    _id: {type: Schema.Types.ObjectId, unique: true},
    diet_id: {type: Schema.Types.ObjectId, required: true, ref: 'diets'},
    user_id: {type: Schema.Types.ObjectId, required: true, ref: 'users'},
    price: {type: Number, required: true},
    sub_date: {
        from: {type: Schema.Types.Date},
        to: {type: Schema.Types.Date},
        required: true
    },
    withWeekends: {type: Boolean, required: true, default: false}
})
export default mongoose.model('orders', orderSchema)