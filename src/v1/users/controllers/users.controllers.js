const Joi = require("joi");
const BadRequestError = require("../../../errors/bad-request");
const User = require("../models");
const {
  emailVerifyValidator,
  changePasswordValidator,
  userProfileValidator,
} = require("../validators");
const { emailVerification } = require("../../../utils/email");

exports.dashboardController = async (req, res) => {
  const user = await User.findOne(
    { _id: req.user.id },
    { fullname: 1, email: 1, phone: 1, role: 1 }
  );

  const percentageCompleted = Object.keys(user).length * 25;

  return res.json({
    status: "success",
    percentageCompleted,
  });
};

/**
 * Set fullname
 * @method POST
 * @api /users/profile
 * @access client
 */
exports.setProfile = async (req, res) => {
  // validate input
  const { error, value } = userProfileValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  const user = await User.findOne({ _id: req.user.id }, { fullname: 1 });

  user.fullname = value.firstname + " " + value.lastname;

  await user.save();

  return res.json({
    status: "success",
    message: "Fullname updated",
    user,
  });
};

/**
 * Request OTP to verify email
 * @method POST
 * @api /users/verify/email/otp
 * @access public
 */
exports.getEmailOtp = async (req, res) => {
  const { error, value } = Joi.string()
    .email()
    .lowercase()
    .validate(req.body?.email);
  if (error) throw new BadRequestError(error.message);

  // find user
  const user = await User.findOne({ email: value, is_verified: 0 });
  if (!user) throw new BadRequestError("Invalid user email!");

  // set otp and otp expire time
  const otp = Math.floor(100000 + Math.random() * 900000);
  await emailVerification(user.fullname, user.email, otp); // send email verification otp over email
  const expireTime = Date.now() + 10 * 60000; // 10 min from now
  user.otp = otp;
  user.otpExpireTime = expireTime;

  await user.save();

  return res.json({
    status: "success",
    message: `Verification email sent to ${user.email}`,
  });
};

/**
 * Make an user verified by matching OTP sent on user email
 * @method PUT
 * @api /users/verify/email
 * @access public
 */
exports.verifyEmail = async (req, res) => {
  const { error, value } = emailVerifyValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  // find user and match otp
  const user = await User.findOne({ email: value.email });

  if (Date.now() > user.otpExpireTime)
    throw new BadRequestError("OTP Expired!");

  if (user.otp != value.otp) throw new BadRequestError("Invalid OTP!");

  // user.is_active = 1;
  user.created_on = Date.now();
  user.is_verified = 1;
  user.otp = null;
  user.otpExpireTime = null;

  await user.save();

  return res.json({
    status: "success",
    message: "User email verified. Try login.",
  });
};

/**
 * Make an user verified by matching OTP sent on user email
 * @method POST
 * @api /users/password/change
 * @access public/client
 */
exports.changePassword = async (req, res) => {
  const { error, value } = changePasswordValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  let user = null;
  // if user is authenticated, check if old pasword == new password.
  // then compare password
  if (req.user) {
    user = await User.findOne({ _id: req.user.id });
    if (value.existing_password === value.new_password)
      throw new BadRequestError(
        "New password can't be same as existing password!"
      );
    // compare password and logout if exising password doesn't match
    const isPasswordMatched = await user.comparePassword(
      value.existing_password
    );
    if (!isPasswordMatched) {
      // req.logout(); // UNCOMMENT IF NEEDED
      throw new BadRequestError("Invalid password.");
    }
  } else {
    // find user and match otp
    user = await User.findOne({ email: value.email });

    if (Date.now() > user.otpExpireTime)
      throw new BadRequestError("OTP Expired!");

    if (user.otp != value.otp) throw new BadRequestError("Invalid OTP!");
  }

  // hash password
  user.password = value.new_password;
  user.otp = null;
  user.otpExpireTime = null;
  await user.save();

  return res.json({
    status: "success",
    message: "Password changed successfully!",
  });
};
