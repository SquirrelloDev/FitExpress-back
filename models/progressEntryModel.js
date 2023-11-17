import mongoose, {Schema} from "mongoose";
const progressEntrySchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, required: true},
    weight_progress: [
        {
            date: {type: Schema.Types.Date, required: true},
            weight: {type: Number, required: true}
        }
    ],
    water_progress: [
        {
            date: {type: Schema.Types.Date, required: true},
            water: {type: Number, required: true}
        }
    ]
})
export default mongoose.model('Progress_Entry', progressEntrySchema);