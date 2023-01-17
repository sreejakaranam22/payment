const Joi = require("joi");

const profileValidator = (user) => {
  const schema = Joi.object({
    firstname: Joi.string().min(1).max(100).required(),
    lastname: Joi.string().min(1).max(100).required(),
  });

  return schema.validate(user);
};

module.exports = profileValidator;
