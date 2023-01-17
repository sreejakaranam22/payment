const BadRequestError = require("../../../errors/bad-request");
const User = require("../models");
const { userRegistrationValidator } = require("../validators");
const { emailVerification } = require("../../../utils/email");

/**
 * Create an user
 * @method POST
 * @api /users/register
 * @access public
 */
exports.createUser = async (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/auth/login/success");
  // input validation
  const { error, value } = userRegistrationValidator(req.body);
  if (error) throw new BadRequestError(error.message);
  // if user exists
  const existsUser = await User.findOne({ email: value.email });
  if (existsUser) throw new BadRequestError("Email already in use.");

  // 🔽🔽🔽 ======== optimize this logic  ============ 🔽🔽🔽
  const existsUserPhone = await User.findOne({ phone: value.phone });
  if (value.phone && existsUserPhone)
    throw new BadRequestError("Phone number already in use.");
  // 🔼🔼🔼 ========================================== 🔼🔼🔼

  const user = await User.create(value);

  // set otp and otp expire time
  const otp = Math.floor(100000 + Math.random() * 900000);
  await emailVerification(value.fullname, value.email, otp); // send email verification otp over email
  const expireTime = Date.now() + 10 * 60000; // 10 min from now
  user.otp = otp;
  user.otpExpireTime = expireTime;

  await user.save();

  return res.status(201).json({
    status: "success",
    message: `Verification email sent to ${value.email}`,
  });
};
