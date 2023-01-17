const Joi = require("joi");

const resetPasswordValidator = (request) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    otp: Joi.string().length(6).required(),
  });

  return schema.validate(request);
};

module.exports = resetPasswordValidator;
