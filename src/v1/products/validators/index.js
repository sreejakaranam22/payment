const Joi = require("joi");

const createProductValidator = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    price: Joi.number().min(1).required(),
    features: Joi.array().items(Joi.string()),
  });

  return schema.validate(product);
};

module.exports = { createProductValidator };
