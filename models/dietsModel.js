import mongoose, {Schema} from "mongoose";
const dietsSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    diet_type: {type: String, required: true, enum: ['Fixed', 'Flexi']},
    img_path: {type: String},
    short_desc: {type: String, required: true},
    long_desc: {type: String, required: true},
    basic_info: {type: [String]},
    macros: {
        fats: {type: Number},
        proteins: {type: Number},
        carbs: {type: Number}
    },
    exclusions: {type: [Schema.Types.ObjectId], ref: 'Exclusion'},
    prices: {type: Map, of: Number}

})
export default mongoose.model('Diet', dietsSchema)