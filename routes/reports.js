import express from "express";
import {
    createReport, deleteReport,
    getAllReports,
    getReportById,
    getUserReports,
    updateReport, updateReportStatus
} from "../controllers/reportsController.js";
const router = express.Router();
router.get('/', getAllReports);
router.get('/user', getUserReports);
router.get('/:id', getReportById);
router.post('/', createReport);
router.put('/:id', updateReport);
router.patch('/:id', updateReportStatus)
router.delete('/:id', deleteReport);
export {router as reportsRouter}