const Joi = require("joi");

const razorpayResponseValidator = (rp_response) => {
  const schema = Joi.object({
    razorpay_payment_id: Joi.string().min(1).max(1000).required(),
    razorpay_order_id: Joi.string().min(1).max(1000).required(),
    razorpay_signature: Joi.string().min(1).max(1000).required(),
    status_code: Joi.number()
  });

  return schema.validate(rp_response);
};

module.exports = razorpayResponseValidator;
