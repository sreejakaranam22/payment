const Joi = require("joi");

const changePassword = (request) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().lowercase(),
    otp: Joi.string().length(6),
    existing_password: Joi.string().required(),
    new_password: Joi.string().required(),
    confirm_password: Joi.ref("new_password"),
  });

  return schema.validate(request);
};

module.exports = changePassword;
