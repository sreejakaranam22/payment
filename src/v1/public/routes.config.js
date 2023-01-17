const Joi = require("joi");
const s3 = require("../../config/s3");
const BadRequestError = require("../../errors/bad-request");
const AVAILABLE_PINCODES = require("../data/pincodes");

const router = require("express").Router();

router.get("/public/available-pincodes", (req, res) => {
  const { error, value } = Joi.object({
    pincode: Joi.number().min(100000).max(999999).required(),
  }).validate(req.query);
  if (error) throw new BadRequestError(error.message);
  //   AVAILABLE_PINCODES
  if (AVAILABLE_PINCODES.indexOf(value.pincode) < 0)
    throw new BadRequestError(
      "We are trying to expand our service to your area soon. Currently it is outside of our service area."
    );

  return res.json({
    message: "Great! This pin code is in our service area.",
  });
});

// router.post("/public/report", async (req, res) => {
//   if (
//     !req.files ||
//     Object.keys(req.files).length === 0 ||
//     !(req.files.report?.name.split(".").pop() === "pdf")
//   )
//     throw new BadRequestError("No PDF file selected");

//   const params = {
//     Bucket: "iomreports",
//     Key: "test.pdf",
//     Body: Buffer.from(req.files.report.data, "binary"),
//   };

//   const uploaded = await s3.upload(params).promise();

//   return res.json({
//     success: true,
//     uploaded,
//   });
// });

module.exports = router;
