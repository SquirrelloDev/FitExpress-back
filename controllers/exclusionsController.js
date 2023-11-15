import Exclusion from '../models/exclusionsModel.js'
import Meal from '../models/mealsModel.js'
import Diet from '../models/dietsModel.js'
export const getExclusions = async (req, res, next) => {
    const exclusions = await Exclusion.find({});
    res.status(200);
    res.json(exclusions)
}
export const addExclusion = async (req, res, next) => {
    const exclusionName = req.body.name;
    const existingExclusion = await Exclusion.findOne({name: exclusionName})
    if(existingExclusion){
        res.status(500)
        return res.json({message: 'Exclusion already exists!'})
    }
    const exclusion = new Exclusion({
        name: exclusionName
    })
    const createdExclusion = await exclusion.save()
    if (!createdExclusion) {
        res.status(500);
        return res.json({message: 'Error while creating an exclusion'})
    }
    res.status(201)
    res.json({message: 'Exclusion added'})
}
export const updateExclusion = async (req, res, next) => {
    const exclusionName = req.body.name;
    const id = req.params.id
    const updatedExclusion = await Exclusion.findByIdAndUpdate(id, {name: exclusionName})
    if (!updatedExclusion) {
        res.status(500);
        return res.json({message: 'Error while creating an exclusion'})
    }
    res.status(200)
    res.json({message: 'Exclusion updated'})
}
export const deleteExclusion = async (req, res, next) => {
    const id = req.params.id
    const deletedExclusion = await Exclusion.findByIdAndDelete(id);
    if(!deletedExclusion){
        res.status(404);
        return  res.json({message: 'Exclusion not found!'})
    }
    await Meal.updateMany({}, {$pull: {"exclusions": deletedExclusion._id}});
    await Diet.updateMany({}, {$pull: {"exclusions": deletedExclusion._id}});
    res.status(200);
    res.json({message: 'Exclusion deleted!'})
}