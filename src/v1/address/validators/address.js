const Joi = require("joi");

const addressValidator = (address) => {
  const schema = Joi.object({
    _id: Joi.string(),
    firstname: Joi.string().min(1).max(200).required(),             //.alphanum()
    lastname: Joi.string().min(1).max(200).required(),     //.alphanum()
    phone: Joi.number().required(),
    address_type: Joi.string().required().valid("home", "office", "other"),
    address: Joi.string()
      .min(1)
      .max(255)
      .required()
      .error(new Error("Invalid address line 1")),
    address_two: Joi.string()
      .min(1)
      .max(255)
      .required()
      .error(new Error("Invalid address line 2")),
    landmark: Joi.string().allow("").max(255),
    city: Joi.string().min(1).max(255).required(),
    state: Joi.string().min(1).max(255).required(),
    zip: Joi.number().required(),
  });

  return schema.validate(address);
};

module.exports = addressValidator;
