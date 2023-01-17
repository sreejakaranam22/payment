const Joi = require("joi");

const loginValidator = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().max(255).required(),
  });

  return schema.validate(user);
};

module.exports = loginValidator;
