import mongoose, {Schema} from "mongoose";

const addresesSchema = new mongoose.Schema({
    street: {type: String, required: true},
    city: {type: String, required: true},
    postal: {type: String, required: true},
    building_no: {type: Number, required: true},
    apartment_no: {type: Number},
    voivodeship: {
        type: String,
        required: true,
        enum: ['Zachodniopomorskie', 'Pomorskie', 'Warmińsko-Mazurskie', 'Podlaskie', 'Lubuskie', 'Wielkopolskie', 'Łódzkie', 'Mazowieckie', 'Świętokrzyskie', 'Lubelskie', 'Dolnośląskie', 'Opolskie', 'Śląskie', 'Małopolskie', 'Podkarpackie'],
    },
    extra_info: {type: String, required: true},
    is_weekend: {type: Boolean, required: true, default: false},
    is_default: {type: Boolean, required: true, default: false},
    user_id: {type: Schema.Types.ObjectId, ref: 'users'}
})
export default mongoose.model('Address', addresesSchema)