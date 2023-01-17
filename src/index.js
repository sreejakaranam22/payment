"use strict";

const express = require("express");
require("express-async-errors");
const expressSession = require("express-session");
const fileUpload = require("express-fileupload");
const MongoDBSessionStore = require("connect-mongodb-session")(expressSession);
// const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const passport = require("passport");

const config = require("./config/env.config");
const { errorHandler } = require("./utils/error-handler");
const NotFoundError = require("./errors/not-found-error");
const { default: mongoose } = require("mongoose");

const app = express();
require(`./${config.API_VERSION}/users/config/passport`)(passport);

const allowCrossDomain = function (req, res, next) {
  let browser = req.headers["user-agent"];

  if (/Trident|Edge/.test(browser)) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
  }

  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,OPTIONS,PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-HTTP-Method-Override, uid, hash, mid"
  );

  if (req.session && !req.session.host) {
    req.session.host = req.headers.host;
    req.session.baseUrl = req.baseURI;
  }

  next();
};
// const corsOptions = {
//   origin: config.CLIENT_URL,
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
const limit = rateLimit({
  max: 10000, // max requests
  windowMs: 15 * 60 * 1000, // 1 Hour
  message: "Too many requests, Please Try after 15 Minuts ", // message to send
});

// session configuration
app.use(
  expressSession({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    name: "_iom",
    proxy: true,
    // cookie: {
    //   secure: config.NODE_ENV !== "development",
    //   httpOnly: true,
    //   maxAge: 3600000 * 24 * 28, // one hour * 24 * 28 = one month
    //   sameSite: "none",
    // },
    store: new MongoDBSessionStore({
      uri: config.MONGO_URI,
      collection: "Sessions",
    }),
  })
);
app.set("trust proxy", true);
app.use("/", limit);
// app.use(cors(corsOptions));
app.use(allowCrossDomain);
app.use(express.json({ limit: "20kb" }));
app.use(xss());
app.use(helmet());
app.use(
  compression({
    level: 6,
    threshold: 2 * 1000, // don't compress below 2kb
  })
);

app.get("/", (req, res) => {
  return res.send("IOM API version " + config.API_VERSION);
});

// passport middleware
app.use(passport.initialize());
app.use(passport.authenticate("session"));
app.use(passport.session());

// file upload middleware
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));

// Public
const Public = require(`./${config.API_VERSION}/public/routes.config`);
app.use(Public);

// users
const Users = require(`./${config.API_VERSION}/users/routes.config`);
Users.routesConfig(app);

// admin
const Notifications = require(`./${config.API_VERSION}/notifications/routes.config`);
app.use(Notifications);

// products (healthkits)
const Products = require(`./${config.API_VERSION}/products/routes.config`);
app.use(Products);

// cart
const Carts = require(`./${config.API_VERSION}/cart/routes.config`);
app.use(Carts);

// client address
const Address = require(`./${config.API_VERSION}/address/routes.config`);
app.use(Address);

//client order
const Order = require(`./${config.API_VERSION}/orders/routes.config`);
app.use(Order);

// pickups
const Pickups = require(`./${config.API_VERSION}/pickups/routes.config`);
app.use(Pickups);

//client order
const Member = require(`./${config.API_VERSION}/member/routes.config`);
app.use(Member);

// warehouse
const Warehouse = require(`./${config.API_VERSION}/warehouse/routes.config`);
app.use(Warehouse);

// logistics
const Logistics = require(`./${config.API_VERSION}/logistics/routes.config`);
app.use(Logistics);

// clinical partner
const ClinicalParter = require(`./${config.API_VERSION}/clinical/routes.config`);
app.use(ClinicalParter);

// clinical partner
const AiTeam = require(`./${config.API_VERSION}/ai-team/routes.config`);
app.use(AiTeam);

// Questionnaire
const Questionnaire = require(`./${config.API_VERSION}/questionnaire/routes.config`);
app.use(Questionnaire);

// admin
const Superadmin = require(`./${config.API_VERSION}/admin/routes.config`);
app.use(Superadmin);

// admin
const Reports = require(`./${config.API_VERSION}/reports/routes.config`);
app.use(Reports);

// conatct us
const ContactUs = require(`./${config.API_VERSION}/contactus/routes`);
app.use(ContactUs);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

app.listen(process.env.PORT || config.PORT, function () {
  mongoose
    .connect(config.MONGO_URI)
    .then(() => {
      console.log("Connected with mongodb");
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
