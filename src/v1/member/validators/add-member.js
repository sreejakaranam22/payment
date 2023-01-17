const Joi = require("joi");

const memberValidator = (member) => {
  const schema = Joi.object({
    _id: Joi.string(),
    firstname: Joi.string().alphanum().min(1).max(255).required(),
    lastname: Joi.string().alphanum().min(1).max(255).required(),
    age: Joi.number().min(1).max(145).required(),
    gender: Joi.string().required().valid("male", "female", "other"),
    blood_type: Joi.string()
     
      .valid("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"),
    existing_disease: Joi.string().allow("").max(255),
    details: Joi.string().allow("").max(3000),
  });

  return schema.validate(member);
};

module.exports = memberValidator;
