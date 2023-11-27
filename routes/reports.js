import express from "express";
import {
    createReport, deleteReport,
    getAllReports,
    getReportById,
    getUserReports,
    updateReport, updateReportStatus
} from "../controllers/reportsController.js";
import isAuth from "../middleware/isAuth.js";
const router = express.Router();
router.get('/', isAuth, getAllReports);
router.get('/user', isAuth, getUserReports);
router.get('/:id', isAuth, getReportById);
router.post('/', isAuth, createReport);
router.put('/:id', isAuth, updateReport);
router.patch('/:id', isAuth, updateReportStatus)
router.delete('/:id', isAuth, deleteReport);
export {router as reportsRouter}