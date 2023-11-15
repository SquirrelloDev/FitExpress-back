import mongoose, {Schema} from "mongoose";

const fixedSchema = new mongoose.Schema({
    date: {type: Schema.Types.Date, required: true, unique: true},
    diets: [
        {
            diet_id: {type: Schema.Types.ObjectId, ref: 'Diet'},
            meals: {
                morning: {type: Schema.Types.ObjectId, ref: 'Meal'},
                lunch: {type: Schema.Types.ObjectId, ref: 'Meal'},
                dinner: {type: Schema.Types.ObjectId, ref: 'Meal'},
                teatime: {type: Schema.Types.ObjectId, ref: 'Meal'},
                supper: {type: Schema.Types.ObjectId, ref: 'Meal'},
            }
        }
    ]
})
export default mongoose.model('Day_fixed', fixedSchema)