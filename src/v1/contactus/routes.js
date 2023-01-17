const router = require("express").Router();
const ContactUs = require("./model");
const Email = require("../../utils/email");

router.post("/contactus", async (req, res) => {
  await ContactUs.create(req.body);
  await Email.contactusQuery(req.body.name, req.body.email, req.body.message);
  return res.json({
    status: "success",
    message:
      "Sent your query. You can also use the chatbot for smooth interaction.",
  });
});

module.exports = router;
