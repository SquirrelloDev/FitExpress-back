import ProgessEntry from '../models/progressEntryModel.js'

export const getAllProgress = async (req, res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const entries = await ProgessEntry.find({}).skip((page - 1) * pageSize).limit(pageSize).populate("user_id");
    res.status(200);
    res.json(entries);
}
export const getProgressByUser = async (req, res) => {
    const userId = req.query.userId;
    const entry = await ProgessEntry.find({user_id: userId})
    if (!entry) {
        res.status(404);
        return res.json({message: "Entries for that user does not exist for some reason! Contact admin to investigate this issue"})
    }
    res.status(200);
    res.json(entry)
}
export const addEntry = async (req, res) => {
    const entryData = req.body;
    const userId = entryData.userId;
    const entryKind = req.query.kind;
    switch (entryKind.toString()) {
        case 'weight':
            if(Object.keys(entryData.data).includes('water')){
                res.status(422);
                return res.json({mesasge: "The 'weight' key should appear for this kind"})
            }
            await ProgessEntry.findOneAndUpdate({user_id: userId}, {$push: {"weight_progress": entryData.data}});
            break;
        case 'water':
            if(Object.keys(entryData.data).includes('weight')){
                res.status(422);
                return res.json({mesasge: "The 'water' key should appear for this kind"})
            }
            await ProgessEntry.findOneAndUpdate({user_id: userId}, {$push: {"water_progress": entryData.data}});
            break;
    }
    res.status(201);
    res.json({message: 'Entry added'})
}
export const updateEntry = async (req, res) => {

}
export const deleteEntry = async (req, res) => {
    const userId = req.query.userId;
    const date = req.query.date
    const entryKind = req.query.kind;
    switch (entryKind.toString()) {
        case 'weight':
            await ProgessEntry.findOneAndUpdate({user_id: userId}, {$pull: {"weight_progress": {"date": date}}});
            break;
        case 'water':
            await ProgessEntry.findOneAndUpdate({user_id: userId}, {$pull: {"water_progress": {"date": date}}});
            break;
    }
    res.status(200);
    res.json({message: 'Entry deleted'})
}