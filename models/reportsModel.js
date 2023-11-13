import mongoose, {Schema} from "mongoose";

const reportsSchema = new mongoose.Schema({
    _id: {type: Schema.Types.ObjectId, unique: true},
    category: {
        type: String,
        enum: ['openedPackage', 'missingMeal', 'lowQualityMeal', 'differentMeal', 'damagedPackage', 'missingPackage'],
        required: true
    },
    plan_id: {type: Schema.Types.ObjectId, required: true, ref: 'orders'},
    user_id: {type: Schema.Types.ObjectId, required: true, ref: 'users'},
    report_status: {type: String, required: true, enum: ['new', 'pending', 'resolved', 'rejected']},
    message: {type: String},
    delivery_date: {type: Schema.Types.Date, required: true},
    created_at: {type: Schema.Types.Date, required: true}
})
export default mongoose.model('reports', reportsSchema)