const passport = require("passport");
const envConfig = require("../../../config/env.config");
const router = require("express").Router();
const User = require("../models");
const { resetPassword, emailVerification } = require("../../../utils/email");

const authController = require("../controllers/auth.controller");
const {
  isAuthenticated,
  redirectIfAuthenticated,
} = require("../../global/isAuthenticated");
const Users = require("../models");
const {
  resetPasswordValidator

} = require("../validators");

/**
 * manual register with email and password and other basic details
 * @api /auth/register
 */
router.post("/register", authController.createUser);

/**
 * login with email and password  
 * @api /auth/login
 */
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/auth/login/success",
    failureRedirect: "/auth/login/failed",
  })
);

/**
 * this route is automatically redirected by express js after failed local/google/facebook login
 * @api /auth/login/failed
 */
router.get("/login/failed", (req, res) => {
  res.status(400).json({
    status: false,
    message: "Login failed",
  });
});

/**
 * this route is automatically redirected by express js after successful local/google/facebook login and also used by
 * the api client to check authentication
 * @api /auth/login/success
 */
router.get("/login/success", isAuthenticated, (req, res) => {
  res.json({
    status: true,
    message: "Login success",
    user: req.user,
  });
});

router.get("/logout", isAuthenticated, (req, res) => {
  req.logout();
  res.json({
    status: true,
    message: "Successfully logged out",
  });
});

/**
 * login with gmail account
 */
router.get( 
  "/google",
  redirectIfAuthenticated,
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",

  passport.authenticate("google", {
 
    failureRedirect: envConfig.CLIENT_URL + "user/login",
  }),

  (req, res) => {

    res.redirect(envConfig.CLIENT_URL + "user/check");
  }
);
/**
 * login with facebook account
 */
router.get(
  "/facebook",
  redirectIfAuthenticated,
  passport.authenticate("facebook", {
    authType: "reauthenticate",
    scope: ["email"],
  })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: envConfig.CLIENT_URL + "user/login",
  }),
  (req, res) => {
    res.redirect(envConfig.CLIENT_URL + "user/check");
  }
);


router.post("/reset-password", 
// isAuthenticated, 
async (req, res) => {
  // find user and match otp
  const user = await User.findOne({ email: req.body.email });

  if (user) {

    // console.log(user,"user")

    const otp = Math.floor(100000 + Math.random() * 900000);
    await resetPassword(user.fullname, user.email, otp); // send reset password link over email
    const expireTime = Date.now() + 10 * 60000; // 10 min from now
    user.otp = otp;
    user.otpExpireTime = expireTime;
  
    
  // await user.save();

  return res.status(201).json({
    status: "success",
    message: `Verification email sent to ${user.email}`,
    email: user.email
  });

    // res.json({
    //   status: true,
    //   message: "reset",
    // });
  }
  else {
    res.status(400).json({
      status: false,
      message: "this email is not registered",
    });
  } 
});


router.post("/set-password", 
// isAuthenticated, 
async (req, res) => { 


const user = await User.findOne({ email: req.body.email });

console.log(req.body,"req")

if (user) {

  if(req.body.password === req.body.confirmPassword) 
  {
    user.password = req.body.password;
    await user.save();
  
    return res.json({
      status: "success",
      message: "Password changed successfully!",
    });
  }
    // hash password
   
    else{
      res.status(400).json({
        status: false,
        message: "password and confirm password should be same",
      });
    }
}
});


// router.post("/mobileNumber-login", 
// // isAuthenticated, 
// async (req, res) => { 
// console.log(req.body,"req")

//     // find users who are not logged in using google
//     const user = await Users.findOne({
//       phone : req.body.phone,
//       auth_google: 0,
//       auth_facebook: 0,
//     });
// console.log("user",user)

//     if (!user)
//       return
//         res.status(400).json({
//           status: false,
//           message: "user not exist",
//         }
//       );

//     // if (!user.is_active)
//     //   return cb(new ForbiddenError("User is not active!"), false);

//     const isPasswordMatched = await user.comparePassword(req.body.password);
//     if (!isPasswordMatched)
    
//       return
//       res.status(400).json({
//         status: false,
//         message:"Invalid numbrt or password",
//       }
//     );
//     // if (!user.is_verified)
//     //   return cb(
//     //     new ActionRequiredError("User is not verified!", "verify_email"),
//     //     false
//     //   );


//       return res.json({
//         status:success,
//         id: user.id,
//         fullname: user.fullname,
//         email: user.email,
//         role: user.role,
//         is_active: user.is_active,
//        })

  
// });

module.exports = router;
