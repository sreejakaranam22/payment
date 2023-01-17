const Joi = require("joi");

exports.dispatchAssignValidator = (data) => {
  return Joi.object({
    order_id: Joi.string().required(),
    member_id: Joi.string().required(),
  }).validate(data);
};
