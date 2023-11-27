import Report from '../models/reportsModel.js'
import {ApiError} from "../utils/errors.js";
import {checkPermissions} from "../utils/auth.js";

export const getAllReports = async (req, res, next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    try {
        const reports = await Report.find({}).skip((page - 1) * pageSize).limit(pageSize);
        res.status(200);
        res.json(reports);
    } catch (e) {
        next(e);
    }

}
export const getReportById = async (req, res, next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    try {
        const report = await Report.findById(id);
        if (!report) {
            return next(ApiError("Report does not exist!", 404))
        }
        res.status(200);
        res.json(report);
    } catch (e) {
        next(e);
    }

}
export const getUserReports = async (req, res, next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const userId = req.query.userId;
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    try {
        const userReports = await Report.find({user_id: userId}).skip((page - 1) * pageSize).limit(pageSize).populate("order_id");
        if (!userReports) {
            return next(ApiError("User haven't create any report", 404))
        }
        res.status(200);
        res.json(userReports)
    } catch (e) {
        next(e)
    }

}
export const createReport = async (req, res, next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const reportData = req.body;
    const report = new Report({
        ...reportData,
        order_id: reportData.orderId,
        user_id: reportData.userId,
        report_status: 'new',
        delivery_date: reportData.deliveryDate,
        created_at: new Date()
    })
    try {
        await report.save();
        res.status(201);
        res.json({message: "report created!"})
    } catch (e) {
        next(e);
    }

}
export const updateReport = async (req, res, next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    const reportData = req.body;
    try {
        const updatedReport = await Report.findByIdAndUpdate(id, {
            ...reportData,
            order_id: reportData.orderId,
            deliver_date: reportData.deliveryDate,
        })
        if (!updatedReport) {
            return next(ApiError("Report does not exist!", 404))
        }
        res.status(200);
        res.json({message: "report updated!"})
    } catch (e) {
        next(e);
    }

}
export const updateReportStatus = async (req, res, next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_DIETETICIAN)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    const status = req.query.status;
    try {
        const updatedReport = await Report.findByIdAndUpdate(id, {
            report_status: status
        })
        if (!updatedReport) {
            return next(ApiError("Report does not exist!", 404))
        }
        res.status(200);
        res.json({message: "report's status updated!"})
    } catch (e) {
        next(e);
    }

}
//TODO: Add token
export const deleteReport = async (req, res, next) => {
    if(!checkPermissions(req.userInfo, process.env.ACCESS_USER)){
        return next(ApiError("You're not authorized to perform this action!", 401))
    }
    const id = req.params.id;
    try {
        const deletedReport = await Report.findByIdAndDelete(id);
        if (!deletedReport) {
            return next(ApiError("Report does not exist!", 404))
        }
        res.status(200);
        res.json({message: "report deleted!"})
    } catch (e) {
        next(e);
    }

}