import mongoose, {Schema} from "mongoose";
const exclusionsSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
})
export default mongoose.model('Exclusion', exclusionsSchema)