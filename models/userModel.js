import mongoose, {Schema} from "mongoose";
const usersSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    birth_date: {type: Schema.Types.Date, required: true},
    password: {type: String, required: true, minLength: 8, select: false},
    role: {type: Number, default: 0},
    health_data: {
        user_height: {type: Number, required: true},
        user_weight_current: {type: Number, required: true},
        user_weight_planned: {type: Number, required: true},
        gender: {type: String, enum: ['M', 'F']},
        age: {type: Number, required: true},
        pal_active: {type: Number, required: true},
        pal_passive: {type: Number, required: true},
        user_goal: {type: String, required: true, enum: ['burn', 'balance', 'surplus']},
        bmi: {type: Number, required: true},
        bmi_planned: {type: Number},
        calories_demand: {type: Number},
        water_demand: {type: Number}
    },
    order_ids: {type: [Schema.Types.ObjectId], ref: 'Order'},
    addresses: {type: [Schema.Types.ObjectId], ref: 'Address'},
    redeemed_codes: {type: [Schema.Types.ObjectId], ref: 'Promocode'}
})
export default mongoose.model('User', usersSchema)