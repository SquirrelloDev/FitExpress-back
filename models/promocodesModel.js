import mongoose, {Schema} from "mongoose";
const promocodesSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    discount: {type: Number, required: true},
    exp_date: {type: Schema.Types.Date, required: true}
})
export default mongoose.model('Promocode', promocodesSchema)