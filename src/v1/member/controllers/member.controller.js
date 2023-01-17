const BadRequestError = require("../../../errors/bad-request");
const Members = require("../models");
const memberValidator = require("../validators/add-member");

/**
 * Add a member
 * @method POST
 * @api /members/create
 * @access client
 */
exports.addMember = async (req, res) => {
  // input validation
  const { error, value } = memberValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  const member = await Members.create(value);
  member.user = req.user.id;
  await member.save();

  return res.status(201).json({
    status: "success",
    message: "Member created",
    member,
  });
};

/**
 * Get all members
 * @method GET
 * @api /members
 * @access client
 */
exports.getMembers = async (req, res) => {
  const members = await Members.find(
    { user: req.user.id, is_active: true },
    { user: 0 }
  );

  return res.json({
    status: "success",
    // message: "Member created",
    members,
  });
};

/**
 * Get one member
 * @method GET
 * @api /member?member_id
 * @access client
 */
exports.getMember = async (req, res) => {
  const member = await Members.findOne(
    { _id: req.query.member_id, user: req.user.id, is_active: true },
    { user: 0 }
  );

  if (!member) throw new BadRequestError("Invalid member id");

  return res.json({
    status: "success",
    // message: "Member created",
    member,
  });
};

/**
 * Delete a member
 * @method DELETE
 * @api /members/delete
 * @access client
 */
exports.deleteMembers = async (req, res) => {
  const member = await Members.findOne({
    _id: req.body.member_id,
    user: req.user.id,
  });
  if (!member) throw new BadRequestError("Invalid Member Id");

  member.is_active = false;
  await member.save();

  return res.json({
    status: "success",
    message: "Member removed!",
  });
};

/**
 *Update a member details
 * @method PUT
 * @api /members/update
 * @access client
 */
exports.updateMember = async (req, res) => {
  const { error, value } = memberValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  const member = await Members.findOneAndUpdate(
    { _id: value._id, user: req.user.id },
    value,
    {
      new: true,
    }
  );

  return res.json({
    status: "success",
    message: "Member updated",
    member,
  });
};
