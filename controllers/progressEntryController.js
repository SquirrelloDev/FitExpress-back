import ProgessEntry from '../models/progressEntryModel.js'
import {ApiError} from "../utils/errors.js";
import {checkPermissions} from "../utils/auth.js";
import {getNextDayMidnight, parseIntoMidnightISO} from "../utils/dates.js";

export const getAllProgress = async (req, res, next) => {
    if (!await checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    try {
        const entries = await ProgessEntry.find({}).skip((page - 1) * pageSize).limit(pageSize).populate("user_id");
        const totalItems = await ProgessEntry.find({}).countDocuments()
        res.status(200);
        res.json({
            entries,
            paginationInfo: {
                totalItems,
                hasNextPage: pageSize * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / pageSize)
            }
        });
    } catch (e) {
        next(e);
    }

}
export const getProgressByUser = async (req, res, next) => {
    if (!await checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const userId = req.query.userId;
    try {
        const entry = await ProgessEntry.findOne({user_id: userId})
        if (!entry) {
            return next(ApiError("Entries for that user does not exist for some reason! Contact admin to investigate this issue", 404))
        }
        res.status(200);
        res.json(entry)

    } catch (e) {
        next(e);
    }
}
export const addEntry = async (req, res, next) => {
    if (!await checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const entryData = req.body;
    const userId = entryData.userId;
    const entryKind = req.query.kind;
    try {
        switch (entryKind) {
            case 'weight':
                if (Object.keys(entryData.data).includes('water')) {
                    return next(ApiError("The 'weight' key should appear for this kind", 422))
                }
                await ProgessEntry.findOneAndUpdate({user_id: userId}, {$push: {"weight_progress": {date: entryData.data.date, weight: entryData.data.weight} }});
                break;
            case 'water':
                if (Object.keys(entryData.data).includes('weight')) {
                    return next(ApiError("The 'water' key should appear for this kind", 422))
                }
                await ProgessEntry.findOneAndUpdate({user_id: userId}, {$push: {"water_progress": {
                        date: entryData.data.date,
                            water: entryData.data.water
                        }}});
                break;
            default:
                return next(ApiError('No key present', 422))
        }
        res.status(201);
        res.json({message: 'Entry added'})
    } catch (e) {
        next(e);
    }

}
export const updateEntry = async (req, res, next) => {
    if (!await checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const date = req.query.date;
    const entryData = req.body;
    const userId = entryData.userId;
    const selectArr = req.query.kind === 'weight' ? 'weight_progress' : 'water_progress';
    try {
        switch (req.query.kind) {
            case 'weight':
                if (Object.keys(entryData.data).includes('water')) {
                    return next(ApiError("The 'water' key should appear for this kind", 422))
                }
                break;
            case 'water':
                if (Object.keys(entryData.data).includes('weight')) {
                    return next(ApiError("The 'weight' key should appear for this kind", 422))
                }
                break;
            default:
                return next(ApiError('No key present', 422))
        }
        const userProgressDoc = await ProgessEntry.findOne({user_id: userId}).select(selectArr);
        const entries = req.query.kind === 'weight' ? userProgressDoc.weight_progress : userProgressDoc.water_progress;
        const entryIdx = entries.findIndex(entry => entry.date.getTime() === date.getTime())
        entries[entryIdx] = entryData.data;
        await ProgessEntry.updateOne({user_id: userId}, {[selectArr]: entries});
        res.status(200);
        res.json({message: 'Entry updated!'})
    } catch (e) {
        next(e);
    }

}
export const deleteEntry = async (req, res, next) => {
    if (!await checkPermissions(req.userInfo, process.env.ACCESS_USER)) {
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const userId = req.query.userId;
    const date = req.query.date
    const entryKind = req.query.kind;
    try {
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
    } catch (e) {
        next(e);
    }

}