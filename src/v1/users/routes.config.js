const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");

exports.routesConfig = function (app) {
  app.use("/users", userRoutes);
  app.use("/auth", authRoutes);
};
