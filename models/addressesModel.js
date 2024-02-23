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
        enum: ['Zachodniopomorskie', 'Pomorskie', 'Kujawsko-Pomorskie', 'Warmińsko-Mazurskie', 'Podlaskie', 'Lubuskie', 'Wielkopolskie', 'Łódzkie', 'Mazowieckie', 'Świętokrzyskie', 'Lubelskie', 'Dolnośląskie', 'Opolskie', 'Śląskie', 'Małopolskie', 'Podkarpackie'],
    },
    extra_info: {type: String, required: true},
    is_weekend: {type: Boolean, required: true, default: false},
    linked_points: {type: [Schema.ObjectId], ref: 'Delivery_point', default: []},
    user_id: {type: Schema.Types.ObjectId, ref: 'User'}
})
export default mongoose.model('Address', addresesSchema)