const router = require("express").Router();
const { isClient } = require("../global/hasAccess");
const { isAuthenticated } = require("../global/isAuthenticated");
const controller = require("./controllers");

router.post(
  "/questionnaire/basic-details",
  [isAuthenticated, isClient],
  controller.submitBasicDetails
);
router.post(
  "/questionnaire/family-history",
  [isAuthenticated, isClient],
  controller.submitFamilyHistory
);
router.post(
  "/questionnaire/lifestyle",
  [isAuthenticated, isClient],
  controller.submitLifestyle
);
router.post(
  "/questionnaire/state-of-mind",
  [isAuthenticated, isClient],
  controller.submitStateOfMind
);
router.post(
  "/questionnaire/body-constitutions",
  [isAuthenticated, isClient],
  controller.submitBodyConstitutions
);

module.exports = router;
