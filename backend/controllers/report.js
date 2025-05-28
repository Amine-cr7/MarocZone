const Report = require("../models/Report");
const Ad = require("../models/Ad"); // تأكد أنك تستورد الموديل Ad إذا لم يكن مستورد

const createReport = async (req, res) => {
  const { targetType, targetId, reason } = req.body;
  const reporter = req.user.id;

  const report = await Report.create({ reporter, targetType, targetId, reason });
  res.status(201).json(report);
};

const getAllReports = async (req, res) => {
  const reports = await Report.find().populate("reporter", "name email");
  res.status(200).json(reports);
};


const acceptReport = async (req, res) => {
  const report = await Report.findById(req.params.reportId);
  if (!report) return res.status(404).json({ message: "Report not found" });

  if (report.targetType === "Ad") {
    await Ad.findByIdAndDelete(report.targetId);
  }

  await Report.findByIdAndDelete(req.params.reportId);

  res.json({ message: "Report accepted, ad removed" });
};



const deleteReport = async (req, res) => {
  await Report.findByIdAndDelete(req.params.reportId);
  res.json({ message: "Report deleted" });
};

module.exports = {
  createReport,
  getAllReports,
  acceptReport,
  deleteReport,
};
