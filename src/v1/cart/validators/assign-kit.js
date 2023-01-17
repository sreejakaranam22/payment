const Joi = require("joi");

const assignKitValidator = (patients) => {
  const schema = Joi.array().items(
    Joi.object({
       firstname: Joi.string().min(1).max(255),  //.alphanum()
      lastname: Joi.string().min(1).max(255),   //.alphanum()
      age: Joi.number().min(1).max(145),
      gender: Joi.string().valid("male", "female", "other"),
      patient_id: Joi.string().required(),
      _id: Joi.string().alphanum().max(255).required(), // kit id

    })
  );

  return schema.validate(patients);
};

module.exports = assignKitValidator;
