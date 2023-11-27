import Address from '../models/addressesModel.js'
import User from '../models/userModel.js'
import Order from '../models/ordersModel.js'
export const getAddresses = async (req, res, next) => {
    const addresses = await Address.find({})
    res.status(200);
    res.json(addresses)
}
export const getAddressById = async (req, res, next) => {
    const addressId = req.params.id;
    const address = await Address.findById(addressId);
    if(!address){
        res.status(404)
        return res.json({
            message: "Address not found!"
        })
    }
    res.status(200)
    res.json(address)
}
export const getUserAddresses = async (req,res) => {
  const userId = req.params.id;
  const addresses = await Address.find({user_id: userId});
  res.status(200);
  res.json(addresses)
}
export const addAddress = async (req, res, next) => {
    const addressData = req.body.address;
    const userId = req.body.userId;
    const newAddress = new Address({
        street: addressData.street,
        city: addressData.city,
        postal: addressData.postal,
        building_no: addressData.buildingNumber,
        apartment_no: addressData.apartmentNumber,
        voivodeship: addressData.voivodeship,
        extra_info: addressData.extraInfo,
        is_weekend: addressData.isWeekend,
        is_default: addressData.isDefault,
        user_id: userId
    });
    const returnAddress = await newAddress.save()
    const user = await User.findById(userId).select('addresses');
    const userAddresses = user.addresses
    const newAddresses = [...userAddresses, returnAddress._id]
    await User.updateOne({_id: userId}, {addresses: newAddresses})
    res.status(201);
    res.json({
        message: 'Address added sucessfully!',
        statusCode: 201,
        payload: newAddress
    })
}
export const updateAddress = async (req, res, next) => {
    const addressId = req.params.id;
    const addressData = req.body
    const updatedAddress = await Address.findByIdAndUpdate(addressId, addressData, {returnDocument: "after"})
    res.status(200)
    res.json({
        message: "Address updated succesfully",
        payload: updatedAddress
    })
}
export const deleteAddress = async (req,res,next) => {
    const id = req.params.id;

    const deletedAddres = await Address.findByIdAndDelete(id);
    if(deletedAddres){
        const user = await User.findById(deletedAddres.user_id).select('addresses')
        console.log(user)
        const userAddresses = user.addresses
        const updatedAddresses = userAddresses.filter(addressId => addressId.toString() !==  id)
        console.log('Updated', updatedAddresses)
        await User.updateOne({_id: user._id}, {addresses: updatedAddresses})
        await Order.updateMany({address_id: id}, {address_id: ''});
        res.status(200);
        return  res.json({
            message: "Address deleted sucessfully!",
            payload: deletedAddres
        })
    }
    res.status(404);
    res.json({
        message: 'Address for deletion not found!'
    })

}