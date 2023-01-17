const Joi = require("joi");

const orderValidator = (order) => {
  const schema = Joi.object({
    address_id: Joi.string().required(),
    firstname: Joi.string().min(1).max(200), //.required(), //.alphanum()
    lastname: Joi.string().min(1).max(200), //.required(),   //.alphanum()
    address: Joi.string().min(1).max(200), //.required(),
    landmark: Joi.string().allow(null, "").min(1).max(200), //.required(),
    city: Joi.string().min(1).max(255), //.required(),
    state: Joi.string().min(1).max(255), //.required(),
    zip: Joi.number(), //.required(),
    phone: Joi.number(), //.required(),
    order_id:Joi.string()    // kit id changed to this from _id
  });

  return schema.validate(order);
};

module.exports = orderValidator;
