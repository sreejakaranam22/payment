const Users = require("../users/models");
const Pickups = require("../pickups/model");
const kitInstanceModel = require("../cart/models/kit-instance.model");
const BadRequestError = require("../../errors/bad-request");

/**
 * Returns the data required for clinical partner dashboard
 * @method GET
 * @api /clinical/dashboard
 * @access clinical
 */
exports.dashboardController = async (req, res) => {
  const clinicalDashboard = await Users.find(
    { role: "clinical" },
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
    clinicalDashboard,
    kitsCount,
  });
};

/**
 * Set a kit as sample accepted
 * @method PUT
 * @api /clinical/sample/approve
 * @access clinical
 */
exports.sampleApproved = async (req, res) => {
  const kit = await kitInstanceModel.findOne(
    {
      _id: req.body.kitId,
      status: "pickup_completed",
    },
    { status: 1, timestamps: 1, pickup_id: 1 }
  );

  if (!kit) throw new BadRequestError("Invalid kit id");

  kit.status = "sample_approved";
  kit.timestamps.sample_approved_on = Date.now();

  const pickcup = await Pickups.findOne({ _id: kit.pickup_id }, { status: 1 });
  pickcup.status = "sample_approved";

  await kit.save();
  await pickcup.save();

  return res.json({
    status: "success",
    message: "Sample approved",
  });
};

/**
 * Set a kit as sample rejected
 * @method PUT
 * @api /clinical/sample/reject
 * @access clinical
 */
exports.sampleRejected = async (req, res) => {
  const kit = await kitInstanceModel.findOne(
    {
      _id: req.body.kitId,
      status: "pickup_completed",
    },
    { status: 1, sample_rejection_reason: 1, timestamps: 1 }
  );

  if (!kit) throw new BadRequestError("Invalid kit id");

  kit.status = "sample_rejected";
  kit.sample_rejection_reason = req.body.sample_rejection_reason;
  kit.timestamps.sample_rejected_on = Date.now();

  await kit.save();

  return res.json({
    status: "success",
    message: `Sample rejected because of: ${req.body.sample_rejection_reason}`,
  });
};

/**
 * Set a kit as data uploaded
 * @method PUT
 * @api /clinical/sample/data-uploaded
 * @access clinical
 */
exports.dataUploaded = async (req, res) => {
  const kit = await kitInstanceModel.findOne(
    {
      _id: req.body.kitId,
      status: "sample_approved",
    },
    { status: 1, timestamps: 1, pickup_id: 1 }
  );

  if (!kit) throw new BadRequestError("Invalid kit id");

  kit.status = "data_uploaded";
  kit.timestamps.data_uploaded_on = Date.now();

  const pickcup = await Pickups.findOne({ _id: kit.pickup_id }, { status: 1 });
  pickcup.status = "reports_uploaded";

  await kit.save();
  await pickcup.save();

  return res.json({
    status: "success",
    message: `Marked as data uploaded`,
  });
};

/**
 * Get all active samples
 * @method GET
 * @api /clinical/samples
 * @access clinical
 */
exports.activeSamples = async (req, res) => {
  let kits = null;
  // console.log(req.query.status,"status")
  switch (req.query.status) {
    case "received":
      kits = await kitInstanceModel
        .find(
          { status: "pickup_completed" },
          { _id: 1,  timestamps: 1, status: 1, patient_id: 1 }
          
        )
        .populate("patient_id", ["firstname", "lastname"], "member")
        .sort({ _id: -1 });
        console.log("kits", kits)
      break;
    case "active":
      kits = await kitInstanceModel
        .find(
          { status: "sample_approved" },
          { _id: 1, timestamps: 1, status: 1, patient_id: 1 }
        )
        .populate("patient_id", ["firstname", "lastname"], "member")
        .sort({ _id: -1 });
      break;
    case "rejected":
      kits = await kitInstanceModel
        .find(
          { status: "sample_rejected" },
          {
            _id: 1,
            timestamps: 1,
            status: 1,
            patient_id: 1,
            sample_rejection_reason: 1,
          }
        )
        .populate("patient_id", ["firstname", "lastname"], "member")
        .sort({ _id: -1 });
      break;
    case "completed":
      kits = await kitInstanceModel
        .find(
          { status: "data_uploaded" },
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
 * @api /clinical/sample/details?kitId=
 * @access clinical
 */
exports.activeSampleDetails = async (req, res) => {
  const kit = await kitInstanceModel
    .findOne(
      { _id: req.query.kitId },
      { _id: 1, timestamps: 1, patient_id: 1, pickup_id: 1 }
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
