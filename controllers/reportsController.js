import Report from '../models/reportsModel.js'
export const getAllReports = async (req,res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const reports = await Report.find({}).skip((page - 1) * pageSize).limit(pageSize);
    res.status(200);
    res.json(reports);
}
export const getReportById = async (req,res) => {
  const id = req.params.id;
  const report = await Report.findById(id);
  if(!report){
      res.status(404);
      return res.json({message: "Report does not exist!"})
  }
  res.status(200);
  res.json(report);
}
export const getUserReports = async (req,res) => {
    const userId = req.query.userId;
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const userReports = await Report.find({user_id: userId}).skip((page - 1) * pageSize).limit(pageSize).populate("order_id");
    if(!userReports){
        res.status(404);
        return res.json({message: "User haven't create any report"})
    }
    res.status(200);
    res.json(userReports)
}
export const createReport = async (req,res) => {
    const reportData = req.body;
    const report = new Report({
        ...reportData,
        order_id: reportData.orderId,
        user_id: reportData.userId,
        report_status: 'new',
        delivery_date: reportData.deliveryDate,
        created_at: new Date()
    })
    await report.save();
    res.status(201);
    res.json({message: "report created!"})
}
export const updateReport = async (req,res) => {
    const id = req.params.id;
    const reportData = req.body;
    const updatedReport = await Report.findByIdAndUpdate(id, {
        ...reportData,
        order_id: reportData.orderId,
        deliver_date: reportData.deliveryDate,
    })
    if(!updatedReport){
        res.status(404);
        return res.json({message: "Report does not exist!"})
    }
    res.status(200);
    res.json({message: "report updated!"})
}
export const updateReportStatus = async (req,res) =>{
    const id = req.params.id;
    const status =req.query.status;
    const updatedReport = await Report.findByIdAndUpdate(id, {
        report_status: status
    })
    if(!updatedReport){
        res.status(404);
        return res.json({message: "Report does not exist!"})
    }
    res.status(200);
    res.json({message: "report's status updated!"})
}
//TODO: Add token
export const deleteReport = async (req,res) => {
    const id = req.params.id;
    const deletedReport = await Report.findByIdAndDelete(id);
    if(!deletedReport){
        res.status(404);
        return res.json({message: "Report does not exist!"})
    }
    res.status(200);
    res.json({message: "report deleted!"})
}