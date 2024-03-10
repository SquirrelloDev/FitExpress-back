import mongoose, {Schema} from "mongoose";
const tagsSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    icon: {type: String, required: false},
})
export default mongoose.model('Tag', tagsSchema)