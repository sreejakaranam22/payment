const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStraregy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const config = require("../../../config/env.config");
const BadRequestError = require("../../../errors/bad-request");
const ActionRequiredError = require("../../../errors/action-required");
const ForbiddenError = require("../../../errors/forbidden");

const Users = require("../models");
const loginValidator = require("../validators/login");
const Joi = require("joi");

const passportSetup = (passport) => {
  passport.use(
    new FacebookStraregy(
      {
        clientID: config.passport.FACEBOOK_APP_ID,
        clientSecret: config.passport.FACEBOOK_APP_SECRET,
        callbackURL: config.BASE_URL + "auth/facebook/callback",
        profileFields: ["first_name", "last_name", "emails", "picture"],
      },
      async function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        try {
          let user = await Users.findOne({ email: profile._json.email });
          if (user) {
            if (user.auth_facebook !== 1)
              return cb(
                new BadRequestError(
                  "This email is registered with a password. Please manually enter the password to proceed."
                ),
                false
              );
            cb(null, user);
          } else {
            const { error, value } = Joi.object({
              fullname: Joi.string()
                .min(1)
                .max(255)
                .regex(/^\w+(?:\s+\w+)*$/)
                .message("Unsupported character in Fullname")
                .required(),
              email: Joi.string()
                .email()
                .trim()
                .lowercase()
                .required()
                .error(
                  new Error("No valid email is found in your facebook account.")
                ),
            }).validate({
              fullname: profile.name.givenName + " " + profile.name.familyName,
              email: profile._json.email || "",
            });
            if (error) return cb(new BadRequestError(error.message), false);
            user = await Users.create({
              fullname: value.fullname,
              email: value.email,
              // image: profile._json.picture,
              is_verified: profile.emails[0].value ? 1 : 0,
              is_active: profile.emails[0].value ? 1 : 0,
              auth_facebook: 1,
              created_on: Date.now(),
            });
            cb(null, user);
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
  passport.use(
    new GoogleStrategy(
    
      {
        clientID: config.passport.GOOGLE_CLIENT_ID,
        clientSecret: config.passport.GOOGLE_CLIENT_SECRET,
        callbackURL: config.BASE_URL + "auth/google/callback",
      },  
      async function (accessToken, refreshToken, profile, cb) { 
        {console.log("in pass")}
        try {
          let user = await Users.findOne({ email: profile._json.email });
          if (user) {
            if (user.auth_google !== 1)   
              return cb(null,

                new BadRequestError(
                  "This email is registered with a password. Please manually enter the password to proceed."
                ),
                false
              );
            cb(null, user);
          } else {
              user = await Users.create({
              fullname: profile._json.given_name + profile._json.family_name,
              email: profile._json.email,
              image: profile._json.picture,
              is_verified: profile._json.email_verified ? 1 : 0,
              is_active: profile._json.email_verified ? 1 : 0,
              auth_google: 1,
              created_on: Date.now(),
            });
            cb(null, user);
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async function verify(
      email,
      password,
      cb
    ) {
      try {
        // validate user input
        const { error, value } = loginValidator({ email, password });
        if (error) return cb(new BadRequestError(error.message), false);

        // find users who are not logged in using google
        const user = await Users.findOne({
          email: value.email,
          auth_google: 0,
          auth_facebook: 0,
        });
        if (!user)
          return cb(new BadRequestError("Invalid email or password!"), false);

        if (!user.is_active)
          return cb(new ForbiddenError("User is not active!"), false);

        const isPasswordMatched = await user.comparePassword(value.password);
        if (!isPasswordMatched)
          return cb(new BadRequestError("Invalid email or password"), false);

        if (!user.is_verified)
          return cb(
            new ActionRequiredError("User is not verified!", "verify_email"),
            false
          );

        return cb(null, {
          id: user.id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          is_active: user.is_active,
        });
      } catch (error) {
        // throw new ServerError(error.message);
        console.log(error);
      }
    })
  );

  passport.serializeUser((user, callback) => {
    callback(null, user.id);
  });

  passport.deserializeUser((id, callback) => {
    Users.findById(id, (err, user) => {
      callback(err, {
        id: user?.id,
        fullname: user?.fullname,
        email: user?.email,
        role: user?.role,
        is_active: user?.is_active,
      });
    });
  });
};

module.exports = passportSetup;
