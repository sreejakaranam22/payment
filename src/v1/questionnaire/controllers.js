const BadRequestError = require("../../errors/bad-request");
const {
  basicDetailsValidator,
  familyHistoryValidator,
  lifestyleValidator,
  stateOfMindValidator,
  bodyConstitutionValidator,
} = require("./validators");
const Questionnaire = require("./models");
const { Kits } = require("../cart/models");

/**
 * Add basic detials
 * @method POST
 * @api /questionnaire/basic-details
 * @access client
 */
exports.submitBasicDetails = async (req, res) => {
  const { error, value } = basicDetailsValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  const kit = await Kits.findOne(
    { _id: value.kit, status: "dispatch_completed" },
    { _id: 1, questionnaire_id: 1 }
  );
  if (!kit) throw new BadRequestError("Invalid kit id");

  delete value.kit;

  const existingQuestionnaire = await Questionnaire.findOne({
    _id: kit.questionnaire_id,
  });
  if (existingQuestionnaire) {
    existingQuestionnaire.basicDetails = value;
    await existingQuestionnaire.save();
  } else {
    const questionnaire = await Questionnaire.create({
      kit: kit._id,
      basicDetails: value,
    });

    kit.questionnaire_id = questionnaire._id;
    await kit.save();
  }
  return res.status(201).json({ message: "Basic details added" });
};

/**
 * Add family disease detials
 * @method POST
 * @api /questionnaire/family-history
 * @access client
 */
exports.submitFamilyHistory = async (req, res) => {
  const { error, value } = familyHistoryValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  const kit = await Kits.findOne(
    { _id: value.kit, status: "dispatch_completed" },
    { _id: 1 }
  );
  const questionnaire = await Questionnaire.findOne({ kit: value.kit });
  if (!kit || !questionnaire) throw new BadRequestError("Invalid kit id");

  delete value.kit;

  questionnaire.familyHistory = value;
  await questionnaire.save();

  return res.status(200).json({ message: "Family history saved" });
};

/**
 * Add lifestyle detials
 * @method POST
 * @api /questionnaire/lifestyle
 * @access client
 */
exports.submitLifestyle = async (req, res) => {
  const { error, value } = lifestyleValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  const kit = await Kits.findOne(
    { _id: value.kit, status: "dispatch_completed" },
    { _id: 1 }
  );
  const questionnaire = await Questionnaire.findOne({ kit: value.kit });
  if (!kit || !questionnaire) throw new BadRequestError("Invalid kit id");

  delete value.kit;

  questionnaire.lifeStyle = value;
  await questionnaire.save();

  return res.status(200).json({ message: "Lifestyle details saved" });
};

/**
 * Add state-of-mind detials
 * @method POST
 * @api /questionnaire/state-of-mind
 * @access client
 */
exports.submitStateOfMind = async (req, res) => {
  const { error, value } = stateOfMindValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  const kit = await Kits.findOne(
    { _id: value.kit, status: "dispatch_completed" },
    { _id: 1 }
  );
  const questionnaire = await Questionnaire.findOne({ kit: value.kit });
  if (!kit || !questionnaire) throw new BadRequestError("Invalid kit id");

  delete value.kit;

  questionnaire.stateOfMind = value;
  await questionnaire.save();

  return res.status(200).json({ message: "Lifestyle details saved" });
};

/**
 * Add body constitutions detials
 * @method POST
 * @api /questionnaire/body-constitutions
 * @access client
 */
exports.submitBodyConstitutions = async (req, res) => {
  const { error, value } = bodyConstitutionValidator(req.body);
  if (error) throw new BadRequestError(error.message);

  const kit = await Kits.findOne(
    { _id: value.kit, status: "dispatch_completed" },
    { _id: 1 }
  );
  const questionnaire = await Questionnaire.findOne({ kit: value.kit });
  if (!kit || !questionnaire) throw new BadRequestError("Invalid kit id");

  delete value.kit;

  questionnaire.bodyConstitution = value;
  await questionnaire.save();

  return res.status(200).json({ message: "Body Constitutions details saved" });
};
