// const Joi = require("joi");

// const schedulePickup = (rp_response) => {
//   const schema = Joi.object({
//     order_id: Joi.string().required(),
//     date: Joi.number().min(1).max(32).required(),
//     month: Joi.number().min(1).max(12).required(),
//     year: Joi.number().min(2022).max(2023).required(),
//     time: Joi.string()
//       .allow(
//         "08 - 09 AM",
//         "09 - 10 AM",
//         "10 - 11 AM",
//         "11 - 12 AM",
//         "12 - 01 PM",
//         "01 - 02 PM",
//         "02 - 03 PM",
//         "03 - 04 PM",
//         "04 - 05 PM",
//         "05 - 06 PM",
//         "06 - 07 PM"
//       )
//       .required(),
//   });

//   return schema.validate(rp_response);
// };

// module.exports = schedulePickup;
