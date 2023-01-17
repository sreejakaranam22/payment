const Joi = require("joi");

const mobileLoginValidator = (user) => {
  const schema = Joi.object({
    phone :  Joi.string().required(),
    password: Joi.string().max(255).required(),
  });

  return schema.validate(user);
};

module.exports = mobileLoginValidator;