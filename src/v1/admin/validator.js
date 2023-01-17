const Joi = require("joi");

const memberValidator = (user) => {
  const schema = Joi.object({
    fullname: Joi.string()
      .min(1)
      .max(255)
      .regex(/^\w+(?:\s+\w+)*$/)
      .message("Unsupported character in Fullname")
      .required(),
    email: Joi.string().email().trim().lowercase().required(),
    phone: Joi.string().length(10).required(),
    password: Joi.string().min(8).max(255).required(),
    role: Joi.string()
      .valid(
        "logistics-lead",
        "logistics-member",
        "warehouse",
        "clinical",
        "ai"
      )
      .required(),
  });

  return schema.validate(user);
};

const updateMemberValidator = (user) => {
  const schema = Joi.object({
    fullname: Joi.string()
      .min(1)
      .max(255)
      .regex(/^\w+(?:\s+\w+)*$/)
      .message("Unsupported character in Fullname")
      .required(),
    email: Joi.string().email().trim().lowercase().required(),
    phone: Joi.string().length(10).required(),
    role: Joi.string()
      .valid(
        "logistics-lead",
        "logistics-member",
        "warehouse",
        "clinical",
        "ai"
      )
      .required(),
  });

  return schema.validate(user);
};

module.exports = { memberValidator, updateMemberValidator };
