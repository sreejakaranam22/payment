const Notifications = require("./model");

exports.allNotifications = async (req, res) => {
  const notifications = await Notifications.find({ user: req.user.id });
  return res.json({
    status: "success",
    notifications,
  });
};
