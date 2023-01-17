const Notifications = require("./model");
const Users = require("../users/models");
const Email = require("../../utils/email");
const BadRequestError = require("../../errors/bad-request");

exports.orderPlaced = async (user_id, order_id) => {
  const user = await Users.findOne({ _id: user_id }, { email: 1, fullname: 1 });
  if (!user) throw new BadRequestError("Invalid user id");

  const message = `Your order with ID: ${order_id} placed successfully!`;

  await Email.orderPlaced(user.fullname, user.email, order_id);
  await Notifications.create({ user: user, message });
};
