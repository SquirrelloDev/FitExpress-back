import mongoose, {Schema} from "mongoose";
const mealsSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String},
    img: {
        img_path: {type: String},
        uri: {type: String}
    },
    tags_id: {type: [Schema.Types.ObjectId], ref: 'Tag'},
    exclusions: {type: [Schema.Types.ObjectId], ref: 'Exclusion'},
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