import Promocode from '../models/promocodesModel.js'
import User from '../models/userModel.js'
import mongoose from "mongoose";
import userModel from "../models/userModel.js";
export const getPromocodes = async (req,res,next) => {
  const promocodes = await Promocode.find({});
  if(!promocodes){
      res.status(404)
      return res.json({
          message: 'could not find promocodes'
      })
  }
  res.status(200);
  res.json(promocodes)
}
export const getPromocodeByName = async (req,res,next) => {
  const promoName = req.params.name;
  const promocode = await Promocode.findOne({name: promoName});
  if(!promocode){
    res.status(404);
    return res.json({
        message: "Promocode does not exist!"
    })
  }
  if(promocode.exp_date < new Date()){
      res.status(400);
      return res.json({
          message: "Promocode expired"
      })
  }
  res.status(200);
  res.json(promocode)
}
export const createPromocode = async (req,res,next) => {
  const promoData = req.body;
  const existingPromocode = await Promocode.findOne({name: promoData.name});
  if(existingPromocode){
      res.status(500);
      return res.json({
          message: "Promocode already exist!"
      })
  }
  const newPromocode = new Promocode({
      name: promoData.name,
      discount: promoData.discount,
      exp_date: promoData.exp_date
  })
    const result = await newPromocode.save();
    res.status(201);
    res.json({
        message: "Promocode sucessfully added"
    })
}
export const updatePromoData = async (req,res,next) => {
  const id = req.params.id;
  const promoData = req.body;
  const updatedPromocode = await Promocode.findByIdAndUpdate(id, promoData);
  if(updatedPromocode){
      res.status(200);
      res.json({
          message: "Promocode sucessfully updated!"
      })
  }
}
export const deletePromocode = async (req,res,next) => {
  const id = req.params.id;
  const deletedPromocode = await Promocode.findByIdAndDelete(id);
  if(deletedPromocode){
      res.status(200);
      return res.json({
          message: 'Promocode sucessfully deleted'
      })
  }
    res.status(404);
    res.json({
        message: 'Promocode for deletion not found!'
    })
}
export const assignPromoToUser = async (req,res,next) => {
    const paymentData = req.body;
    const userId = paymentData.userId;
    const appliedPromocode = paymentData.appliedPromocode;
    //returned codes array with an _id also
    const userCodes = await User.findById(userId).select("redeemed_codes");
    const newCodes = [...userCodes.redeemed_codes, appliedPromocode];
    await User.updateOne({_id: userId}, {redeemed_codes: newCodes})
    res.status(200)
    res.json({
        message: "codes applied"
    })
}