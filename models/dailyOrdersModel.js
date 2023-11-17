import mongoose, {Schema} from "mongoose";
const dailyOrderSchema = new Schema({
    date: {type: Schema.Types.Date, required: true},
    isAddingLocked: {type: Boolean, required: true, default: false},
    dailyMeals: {type: [Schema.Types.ObjectId], required: true, ref: 'Meal'},
})
export default mongoose.model('Daily_order', dailyOrderSchema);