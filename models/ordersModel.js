import mongoose, {Schema} from "mongoose";
const orderSchema = new mongoose.Schema({
    name: {type: String, required: true},
    diet_id: {type: Schema.Types.ObjectId, required: true, ref: 'Diet'},
    user_id: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    address_id: {type: Schema.Types.ObjectId, required:true, ref: 'Address'},
    price: {type: Number, required: true},
    sub_date: {
        from: {type: Schema.Types.Date, required: true},
        to: {type: Schema.Types.Date, required: true},
    },
    with_weekends: {type: Boolean, required: true, default: false},
    calories: {type: Number, required: true},
    flexi_tier: {type: Number, enum: [1, 2, 3]},
    is_active: {type: Boolean, required: true, default: true}
})
export default mongoose.model('Order', orderSchema)