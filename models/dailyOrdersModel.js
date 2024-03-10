import mongoose, {Schema} from "mongoose";

const dailyOrderSchema = new Schema({
    date: {type: Schema.Types.Date, required: true},
    isAddingLocked: {type: Boolean, required: true, default: false},
    orders: [{
        user_id: {type: Schema.Types.ObjectId, required:true, ref: 'User'},
        diet_id: {type: Schema.Types.ObjectId, ref: 'Diet'},
        order_id: {type: Schema.Types.ObjectId, required: true, ref: 'Order'},
        selected_meals: {type: [Schema.Types.ObjectId], ref: 'Meal'}
    }
    ],
})
export default mongoose.model('Daily_order', dailyOrderSchema);