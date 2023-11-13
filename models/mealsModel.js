import mongoose, {Schema} from "mongoose";
const mealsSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String},
    img_path: {type: String},
    tags_id: {type: [Schema.Types.ObjectId]},
    exclusions: {type: [Schema.Types.ObjectId]},
    ingredients: {type: [String], required: true},
    nutrition_values: {
        calories: {type: Number, required: true},
        carbs: {type: Number, required: true},
        fats: {type: Number, required: true},
        proteins: {type: Number, required: true},
        salt: {type: Number, required: true},

    },

})
export default mongoose.model('Meal', mealsSchema)