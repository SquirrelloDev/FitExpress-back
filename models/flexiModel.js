import mongoose, {Schema} from "mongoose";

const flexiSchema = new mongoose.Schema({
    date: {type: Schema.Types.Date, required: true, unique: true},
    morning_meals: {type: [Schema.Types.ObjectId], required: true, ref: 'Meal'},
    lunch_meals: {type: [Schema.Types.ObjectId], required: true, ref: 'Meal'},
    dinner_meals: {type: [Schema.Types.ObjectId], required: true, ref: 'Meal'},
    teatime_meals: {type: [Schema.Types.ObjectId], required: true, ref: 'Meal'},
    supper_meals: {type: [Schema.Types.ObjectId], required: true, ref: 'Meal'},
})
export default mongoose.model('Day_flexi', flexiSchema)