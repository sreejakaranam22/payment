const BadRequestError = require("../../../errors/bad-request");
const Addresses = require("../models");
const { addressValidator } = require("../validators");
// const AVAILABLE_PINCODES = require("../../data/pincodes");

/**
 * Add an address
 * @method POST
 * @api /address/create
 * @access client
 */
exports.createAddress = async (req, res) => {
  // console.log("calling address")
  // validate input
  const { error, value } = addressValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  const addres_obj = {
    firstname: value.firstname,
    lastname: value.lastname,
    user_id: req.user.id,
    address_type: value.address_type,
    address: value.address,
    address_two: value.address_two,
    landmark: value.landmark || "",
    city: value.city,
    state: value.state,
    zip: value.zip,
    phone: value.phone,
  };

  // if (AVAILABLE_PINCODES.indexOf(value.zip) < 0)
  //   throw new BadRequestError("Entered pincode is out of our service range.");

  const address = await Addresses.create(addres_obj);
  // console.log(address,"address")
  return res.status(201).json({
    status: "success",
    message: "Address created",
    address:address,

  })  ;

};

/**
 * Get all address
 * @method GET
 * @api /address
 * @access client
 */
exports.getAddresses = async (req, res) => {
  // validate input
  const addresses = await Addresses.find(
    {
      user_id: req.user.id,
      is_active: true,
    },
    { user: 0, is_active: 0 }
  );

  return res.json({
    status: "success",
    // message: "All Addresses", // uncomment in needed
    addresses,
  });
};

/**
 * Get an address
 * @method GET
 * @api /address?address_id=
 * @access client
 */
exports.getAddress = async (req, res) => {
  // validate input
  const address = await Addresses.findOne(
    {
      user_id: req.user.id,
      is_active: true,
      _id: req.query.address_id,
    },
    { user: 0, is_active: 0 }
  );

  if (!address) throw new BadRequestError("Invalid address id");

  return res.json({
    status: "success",
    // message: "All Addresses", // uncomment in needed
    address,
  });
};

/**
 * Delete an address
 * @method DELETE
 * @api /address/delete
 * @access client
 */
exports.deleteAddress = async (req, res) => {
  // validate input
  const address = await Addresses.findOne({
    _id: req.body.address_id,
    user: req.user.id,
  });
  if (!address) throw new BadRequestError("Invalid address id");

  address.is_active = false;
  await address.save();

  return res.json({
    status: "success",
    message: "Address removed!",
  });
};

/**
 * Add an address
 * @method PUT
 * @api /address/update
 * @access client
 */
exports.updateAddress = async (req, res) => {
  // validate input
  const { error, value } = addressValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  // if (AVAILABLE_PINCODES.indexOf(value.zip) < 0)
  //   throw new BadRequestError("Entered pincode is out of our service range.");

  const address = await Addresses.findOneAndUpdate(
    { _id: value._id, user: req.user.id },
    value,
    {
      new: true,
    }
  );

  return res.json({
    status: "success",
    message: "Address updated",
    address,
  });
};
