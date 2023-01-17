const BadRequestError = require("../../errors/bad-request");
const schedulePickupValidator = require("./validators");
const Pickups = require("./model");
const Address = require("../address/models");
const kitInstanceModel = require("../cart/models/kit-instance.model");
const Questionnaire = require("../questionnaire/models");

/**
 * List of scheduled pickups
 * @method GET
 * @api /pickups
 * @access client
 */
exports.allPickups = async (req, res) => {
  const pickups = await Pickups.find(
    {
      user: req.user.id,
      is_active: true,
    },
    { _id: 1, status: 1 }
  ).sort({ _id: -1 });

  return res.status(200).json({
    status: "success",
    scheduled_on: pickups,
  });
};

/**
 * Schedule a pickup
 * @method POST
 * @api /pickups/schedule/create
 * @access client
 */
exports.schedulePickup = async (req, res) => {
  // validate input
  if (!req.body.address_id) throw new BadRequestError("Invalid address id");
  const address = await Address.findOne({
    _id: req.body.address_id,
    user: req.user.id,
  });
  if (!address) throw new BadRequestError("Invalid address id");

  let existingPickupRequest = await Pickups.findOne({
    user: req.user.id,
    is_active: false,
  });

  if (!existingPickupRequest) {
    // create new pickup request
    existingPickupRequest = await Pickups.create({
      user: req.user.id,
      address: req.body.address_id,
    });
  } else {
    existingPickupRequest.address = req.body.address_id;
    await existingPickupRequest.save();
  }

  return res.status(201).json({
    status: "success",
    scheduled_on: existingPickupRequest,
    message: `Please select date and time from next page..`,
  });
};

/**
 * Schedule a pickup
 * @method POST
 * @api /pickups/schedule/set-datetime
 * @access client
 */
exports.schedulePickupDatetime = async (req, res) => {
  // validate input
  const { error, value } = schedulePickupValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  const existingPickupRequest = await Pickups.findOne(
    {
      _id: value.pickup_id,
      user: req.user.id,
      is_active: false,
    },
    { date: 1,  address: 1 }
    // time: 1,
  ).populate("address");

  if (!existingPickupRequest)
    throw new BadRequestError("No active pickup request found..");

  (existingPickupRequest.date = new Date(value.year, value.month, value.date)),
    // (existingPickupRequest.time = value.time),
    await existingPickupRequest.save();

  return res.json({
    status: "success",
    scheduled_on: existingPickupRequest,
    message: `Pickup scheduled on ${value.year}/${value.month}/${value.date}`,
    //  between ${value.time}
  });
};

/**
 * Register a kit (draft and preview)
 * @method PUT
 * @api /pickups/register-kit/preview
 * @access client
 */
exports.registerKitPreview = async (req, res) => {
  if (!req.body.kitId || !req.body.pickup_id)
    throw new BadRequestError("Invalid Kit id/Pickup id");

  const kit = await kitInstanceModel.findOne(
    {
      _id: req.body.kitId,
      status: "dispatch_completed",
    },
    { status: 1, pickup_id: 1, added_to_pickup: 1 }
  );
  if (!kit) throw new BadRequestError("Invalid Kit id");

  // TODO: MUST NEED TO ADD VALIDATION
  const existingPickupRequest = await Pickups.findOne(
    {
      user: req.user.id,
      status: { $in: ["created", "registered"] },
      _id: req.body.pickup_id,
    },
    { _id: 1, kits: 1, status: 1, address: 1, date: 1, time: 1 }
  ).populate([
    {
      path: "kits",
      model: "kitInstance",
      select: ["patient_id", "_id"],
      populate: {
        path: "patient_id",
        model: "member",
        select: ["firstname", "lastname", "age", "gender", "blood_type"],
      },
    },
    {
      path: "address",
      model: "address",
      select: ["address", "landmark", "city", "state", "zip"],
    },
  ]);

  if (!existingPickupRequest)
    throw new BadRequestError("No active request found!");

  existingPickupRequest.kits.push(req.body.kitId);

  kit.pickup_id = existingPickupRequest._id;
  kit.added_to_pickup = true;
  existingPickupRequest.status = "registered";

  await kit.save();
  await existingPickupRequest.save();

  const questionnaire = await Questionnaire.findOne({ kit: req.body.kitId });

  return res.json({
    status: "success",
    pickup: existingPickupRequest,
    questionnaire,
    message: "Kit added to the request!",
  });
};

/**
 * Register a kit (save)
 * @method PUT
 * @api /pickups/register-kit/save
 * @access client
 */
exports.registerKitSave = async (req, res) => {
  const existingPickupRequest = await Pickups.findOne(
    {
      user: req.user.id,
      status: "registered",
      _id: req.body.pickupId,
    },
    { kits: 1, is_active: 1, status: 1, address: 1, date: 1, time: 1 }
  ).populate([
    {
      path: "kits",
      model: "kitInstance",
      select: ["patient_id", "_id"],
      populate: {
        path: "patient_id",
        model: "member",
        select: ["firstname", "lastname", "age", "gender", "blood_type"],
      },
    },
    {
      path: "address",
      model: "address",
      select: ["address", "landmark", "city", "state", "zip"],
    },
  ]);

  if (!existingPickupRequest)
    throw new BadRequestError("No active request found!");

  for (const kitId in existingPickupRequest.kits) {
    const kit = await kitInstanceModel.findOne(
      { _id: existingPickupRequest.kits[kitId]._id },
      { status: 1, questionnaire_id: 1 }
    );

    const questionnaire = await Questionnaire.findOne({
      _id: kit.questionnaire_id,
    });
    if (
      !questionnaire ||
      !questionnaire.basicDetails ||
      !questionnaire.familyHistory ||
      !questionnaire.lifeStyle ||
      !questionnaire.stateOfMind ||
      !questionnaire.bodyConstitution
    )
      throw new BadRequestError(`Incomplete Questionnaire for kit ${kit._id}`);
    kit.status = "registered";
    await kit.save();
  }

  existingPickupRequest.is_active = true;
  existingPickupRequest.status = "pickup_scheduled";

  await existingPickupRequest.save();

  return res.json({
    status: "success",
    pickup: existingPickupRequest,
    message: "Pickup scheduled!",
  });
};

/**
 * Fetch pickups details
 * @method GET
 * @api /pickups/register-kit?pickupId=
 * @access client
 */
exports.registeredKitDetails = async (req, res) => {
  const existingPickupRequest = await Pickups.findOne(
    {
      // user: req.user.id,
      // status: {
      //   $in: ["created", "registered"],
      // },
      _id: req.query.pickupId,
    },
    {
      kits: 1,
      status: 1,
      address: 1,
      date: 1,
      time: 1,
      pickedup_by: 1,
      collected_on: 1,
      delivered_on: 1,
      user: 1,
    }
  ).populate([
    {
      path: "kits",
      model: "kitInstance",
      select: ["patient_id", "_id", "product", "status", "questionnaire_id"],
      populate: [
        {
          path: "patient_id",
          model: "member",
          select: ["firstname", "lastname", "age", "gender", "blood_type"],
        },
        {
          path: "product",
          model: "healthkit",
          select: "name",
        },
        {
          path: "questionnaire_id",
          model: "questionnaire",
        },
      ],
    },
    {
      path: "address",
      model: "address",
      select: [
        "address",
        "landmark",
        "city",
        "state",
        "zip",
        "phone",
        "address_type",
      ],
    },
    {
      path: "pickedup_by",
      model: "user",
      select: "fullname",
    },
    {
      path: "user",
      model: "user",
      select: ["fullname", "email", "phone"],
    },
  ]);

  if (!existingPickupRequest)
    throw new BadRequestError("No active request found!");

  return res.json({
    status: "success",
    pickup: existingPickupRequest,
  });
};
