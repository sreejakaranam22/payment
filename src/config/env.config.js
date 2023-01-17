const assert = require("assert");

const NODE_ENV = process.env.NODE_ENV || "production";

// NODE_ENV="development" - local
// NODE_ENV="testing" - heroku
// NODE_ENV="production" - production server

// if (NODE_ENV === "development") {
const dotenv = require("dotenv");
dotenv.config();
// }

const { PORT, HOST, HOST_URL, MONGO_URI } = process.env;

assert(PORT, "PORT is required");
// assert(HOST, "HOST is required");
assert(MONGO_URI, "MONGO_URI is required");

module.exports = {  
  SITE_NAME: "IOM",
  BASE_URL:
    NODE_ENV == "development"
      ? "http://localhost:3000/"
   :  "https://iombio.com/api/",
    // : 'http://13.126.219.189/api',
  CLIENT_URL:
    NODE_ENV == "development" || NODE_ENV == "testing"
      ? "http://localhost:3001/"
      : "https://iombio.com/",
      // : 'http://13.126.219.189',
  API_VERSION: "v1",
  JWT_SECRET:
    process.env.JWT_SECRET || "n789yt87cbuag8cgajbsqt78bxcasgbuy87astd",
  JWT_EXPIRES_TIME: 900, // sec
  NODE_ENV: NODE_ENV,

  // session secret
  SESSION_SECRET:
    process.env.SESSION_SECRET || "aiohsj98yda9sbd678dadg7a8wt78g",

  // database
  MONGO_URI: process.env.MONGO_URI,

  // email options
  email: {
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || "",
    SMTP_EMAIL: process.env.SMTP_EMAIL || "",
    SMTP_HOST: process.env.SMTP_HOST || "",
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || "",
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || "",
    SMTP_PORT: 465,
  },

  // passport authentication
  passport: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || "",
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || "",
  },

  // payment
  razorpay: {
   
    // KEY_ID: "rzp_test_w4mtWpHOb6e78C",
    //  KEY_SECRET: "yzRNOf5r2JHeuGq2VAlogEMx",
     KEY_ID:  "rzp_live_sDNvAh7hFPL4o5",
     KEY_SECRET:  "tzQOTkQdgXrqqssNq4FHLIY3"
  },
};
