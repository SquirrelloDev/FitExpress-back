import mongoose, {Schema} from "mongoose";

const reportsSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['openedPackage', 'missingMeal', 'lowQualityMeal', 'differentMeal', 'damagedPackage', 'missingPackage', 'other'],
        required: true
    },
    order_id: {type: Schema.Types.ObjectId, required: true, ref: 'Order'},
    user_id: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    report_status: {type: String, required: true, enum: ['new', 'pending', 'resolved', 'rejected']},
    message: {type: String},
    delivery_date: {type: Schema.Types.Date, required: true},
    created_at: {type: Schema.Types.Date, required: true}
})
export default mongoose.model('Report', reportsSchema)