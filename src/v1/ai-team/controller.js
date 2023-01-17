const Users = require("../users/models");
const kitInstanceModel = require("../cart/models/kit-instance.model");
const Pickups = require("../pickups/model");
const path = require("path");
const BadRequestError = require("../../errors/bad-request");
const s3 = require("../../config/s3");

/**
 * Returns the data required for clinical partner dashboard
 * @method GET
 * @api /ai/dashboard
 * @access ai
 */
exports.dashboardController = async (req, res) => {
  const aiMembers = await Users.find(
    { role: "ai" },
    { fullname: 1, email: 1, created_on: 1, phone: 1 }
  );

  const kitsCount = await kitInstanceModel.aggregate([
    { $match: { is_active: true } },
    {
      $group: { _id: "$status", count: { $sum: 1 } },
    },
  ]);

  return res.json({
    status: "success",
    aiMembers,
    kitsCount,
  });
};

/**
 * Get all active samples
 * @method GET
 * @api /ai/samples
 * @access ai
 */
exports.activeSamples = async (req, res) => {
  let kits = null;
  switch (req.query.status) {
    case "received":
      kits = await kitInstanceModel
        .find(
          { status: "data_uploaded" },
          { _id: 1, timestamps: 1, status: 1, patient_id: 1 }
        )
        .populate("patient_id", ["firstname", "lastname"], "member")
        .sort({ _id: -1 });
      break;
    case "active":
      kits = await kitInstanceModel
        .find(
          { status: "data_processing" },
          { _id: 1, timestamps: 1, status: 1, patient_id: 1 }
        )
        .populate("patient_id", ["firstname", "lastname"], "member")
        .sort({ _id: -1 });
      break;
    case "completed":
      kits = await kitInstanceModel
        .find(
          { status: "reports_uploaded" },
          { _id: 1, timestamps: 1, status: 1, patient_id: 1 }
        )
        .populate("patient_id", ["firstname", "lastname"], "member")
        .sort({ _id: -1 });
      break;

    default:
      break;
  }

  return res.json({
    status: "success",
    kits,
  });
};

/**
 * Get details of samples
 * @method GET
 * @api /ai/sample/details?kitId=
 * @access ai
 */
exports.activeSampleDetails = async (req, res) => {
  const kit = await kitInstanceModel
    .findOne(
      { _id: req.query.kitId },
      { _id: 1, timestamps: 1, patient_id: 1, pickup_id: 1, status: 1 }
    )
    .populate([
      {
        path: "patient_id",
        select: ["firstname", "lastname", "age", "gender", "blood_type"],
        model: "member",
      },
      {
        path: "pickup_id",
        select: "user",
        model: "pickups",
        populate: {
          path: "user",
          select: ["fullname", "email", "phone"],
          model: "user",
        },
      },
    ]);

  if (!kit) throw new BadRequestError("Invalid kit id");

  return res.json({
    status: "success",
    kit,
  });
};

/**
 * Set a kit as data processiong
 * @method PUT
 * @api /ai/sample/data-processing
 * @access ai
 */
exports.setDataProcessing = async (req, res) => {
  const kit = await kitInstanceModel.findOne(
    {
      _id: req.body.kitId,
      status: "data_uploaded",
    },
    { status: 1, timestamps: 1 }
  );

  if (!kit) throw new BadRequestError("Invalid kit id");

  kit.status = "data_processing";
  kit.timestamps.data_processing_started = Date.now();

  await kit.save();

  return res.json({
    status: "success",
    message: `Marked as data processing`,
  });
};

/**
 * Set a kit as report uploaded
 * @method PUT
 * @api /ai/sample/report-uploaded
 * @access ai
 */
exports.setReportUploaded = async (req, res) => {
  const kit = await kitInstanceModel.findOne(
    {
      _id: req.body.kitId,
      status: "data_processing",
    },
    { status: 1, timestamps: 1, pickup_id: 1, report_name: 1 }
  );

  if (!kit) throw new BadRequestError("Invalid kit id");

  if (
    !req.files ||
    Object.keys(req.files).length === 0 ||
    !(req.files.report?.name.split(".").pop() === "pdf")
  )
    throw new BadRequestError("No PDF file selected");

  let reportFile = req.files.report;
  // reportFile.mv(
  //   path.resolve(
  //     path.normalize(__dirname + "../../../../reports/" + reportFilename)
  //   ),
  //   function (err) {
  //     if (err)
  //       throw new BadRequestError(
  //         process.env.NODE_ENV === "production" ? "Upload failed" : err
  //       );
  //   }
  // );

  const params = {
    Bucket: "iomreports",
    Key: `${kit._id}.${reportFile.name.split(".").pop()}`,
    Body: Buffer.from(req.files.report.data, "binary"),
  };

  const uploaded = await s3.upload(params).promise();

  const pickcup = await Pickups.findOne({ _id: kit.pickup_id }, { status: 1 });
  pickcup.status = "report_uploaded";

  kit.status = "reports_uploaded";
  kit.report_name = uploaded.Location;
  kit.timestamps.data_processing_ended = Date.now();

  await kit.save();
  await pickcup.save();

  return res.json({
    status: "success",
    message: `Marked as report uploaded`,
  });
};
