const Joi = require("joi");

const cartValidator = (product_id) => {
  const schema = Joi.object({
    product_id: Joi.string().alphanum().max(255).required(),
  });

  return schema.validate(product_id);
};

module.exports = cartValidator;
