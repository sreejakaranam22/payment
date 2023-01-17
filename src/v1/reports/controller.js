const s3 = require("../../config/s3");
const Pickups = require("../pickups/model");
const BadRequestError = require("../../errors/bad-request");

/**
 * Get reports
 * @method GET
 * @api /reports
 * @access client
 */
exports.sendReport = async (req, res) => {
  const params = {
    Key: `${req.params.kit}.pdf`,
    Bucket: "iomreports",
  };

  const file = s3
    .getObject(params)
    .createReadStream()
    .on("error", (error) => {
      return res.status(404).json({ message: "File not exists" });
    });

  res.contentType("application/pdf");
  file.pipe(res);
};

/**
 * List of available reports per user
 * @method GET
 * @api /reports/available
 * @access client
 */
exports.availableReports = async (req, res) => {
  const pickups = await Pickups.find(
    { user: req.user.id },
    { kits: 1 }
  ).populate({
    path: "kits",
    select: ["timestamps", "patient_id", "report_name", "status"],
    populate: {
      path: "patient_id",
      model: "member",
      select: ["firstname", "lastname", "age", "gender", "blood_type"],
    },
  });

  let reportsAvailable = [];
  pickups.map((pickup) => {
    pickup.kits?.map(async (kit) => {
      if (kit.status === "reports_uploaded") reportsAvailable.push(kit);
    });
  });

  return res.json({
    status: "success",
    data: reportsAvailable,
  });
};
