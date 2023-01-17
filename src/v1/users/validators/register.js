const Joi = require("joi");

const registerValidator = (user) => {
  const schema = Joi.object({
    fullname: Joi.string()
      .min(1)
      .max(255)
      .regex(/^\w+(?:\s+\w+)*$/)
      .message("Unsupported character in Fullname")
      .required(),
    email: Joi.string().email().trim().lowercase().required(),
    phone: Joi.string().length(10).allow(""),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(user);
};

module.exports = registerValidator;
