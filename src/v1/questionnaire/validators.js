const Joi = require("joi");

const basicDetailsValidator = (basicDetails) => {
  const schema = Joi.object({
    kit: Joi.string().required(),
    // fullname: Joi.string()
    //   .min(1)
    //   .max(255)
    //   .regex(/^\w+(?:\s+\w+)*$/)
    //   .message("Unsupported character in Fullname")
    //   .required(),
    // email: Joi.string().email().required(),
    // phone: Joi.string().length(10).required(),
    // city: Joi.string().alphanum().min(1).max(255).required(),
    // age: Joi.number().min(1).max(145).required(),
    // gender: Joi.string().required().valid("male", "female", "other"),
    profession: Joi.string().alphanum().min(1).max(255).required(),
    weight: Joi.number().required(),
    height: Joi.number().required(),
    // income: Joi.string().max(255).required(),
  });

  return schema.validate(basicDetails);
};

const familyHistoryValidator = (familyHistory) => {
  const schema = Joi.object({
    kit: Joi.string().required(),
    familyDiseases: Joi.array().items(Joi.string()).required(),
    familyConditions: Joi.array().items(Joi.string()).required(),
    allergies: Joi.array().items(Joi.string()).required(),
    nutritionalDeficiencies: Joi.array().items(Joi.string()).required(),
  });

  return schema.validate(familyHistory);
};

const lifestyleValidator = (lifestyle) => {
  const schema = Joi.object({
    kit: Joi.string().required(),
    foodHabits: Joi.string().required(),
    // lifestyleDesc: Joi.string().required(),
    problem: Joi.string().required(),
    sleepCycle: Joi.string().required(),
    regularHabits: Joi.array().items(Joi.string()).required(),
    physicalactivity:Joi.string().required(),
     wakeupenergylevel:Joi.number().required(),
     postmealenergylevel:Joi.number().required(),
    nervous:Joi.string().required(),
    worrying:Joi.string().required(),
  });

  return schema.validate(lifestyle);
};

const stateOfMindValidator = (stateofmind) => {
  const schema = Joi.object({
    kit: Joi.string().required(),
    // mood: Joi.string().required(),
    // responseBadExperience: Joi.string().required(),
    challanges: Joi.string().required(),
    learningPattern: Joi.string().required(),
  });

  return schema.validate(stateofmind);
};
const bodyConstitutionValidator = (bodyConstitution) => {
  const schema = Joi.object({
    kit: Joi.string().required(),
    bodyframe: Joi.string().required(),
    bodyTemperature: Joi.string().required(),
    sweat: Joi.string().required(),
    metabolism: Joi.string().required(),
    appetite: Joi.string().required(),
    faeces: Joi.string().required(),
  });

  return schema.validate(bodyConstitution);
};

module.exports = {
  basicDetailsValidator,
  familyHistoryValidator,
  lifestyleValidator,
  stateOfMindValidator,
  bodyConstitutionValidator,
};
