const cssStyle = `<style>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}
.box {
  margin: 5px 5px;
}
.heading {
  margin-left: 10px;
  font-weight: bold;
  text-decoration: underline;
}
.details {
  margin: 25px 40px;
  padding: 5px 10px;
}
.greeting {
  font-weight: bold;
  font-family: "Noto Sans", sans-serif;
  font-size: large;
}
.greetingWillinker {
  margin-top: 10px;
  font-size: large;
}
.salutaion {
  margin-top: 10px;
  font-weight: bold;
  
  font-family: "Noto Sans", sans-serif;
  font-size: medium;
}
.checkLink {
  margin-top: 10px;
  font-weight: bold;
  font-family: "Lato", sans-serif;
  font-size: large;
}
.linkVerify {
  margin-top: 10px;
  font-weight: bold;
  font-family: "Noto Sans", sans-serif;
  font-size: medium;
}
.linkVerify a {
  margin-top: 10px;
  font-weight: bolder;
  font-style: italic;
  font-family: "Roboto", sans-serif;
  font-size: large;
}
.textBody {
  margin-top: 10px;
  font-style: italic;
  font-family: "Source Sans Pro", sans-serif;
  font-size: large;
}
.wish {
  margin-top: 10px;
  font-size: large;
}
.companyName {
  font-size: large;
  font-weight: bolder;
  text-align: center;
}
.alertMessage {
  margin-top: 10px;
 
  font-family: "Noto Sans", sans-serif;
  font-size: medium;
  font-weight: bold;
}
.textBody2 {
  margin-top: 10px;
  font-style: italic;
  font-family: "Source Sans Pro", sans-serif;
  font-size: large;
  
  font-weight: bold;
}
.emailLink a {
  font-family: "Roboto", sans-serif;
  font-size: medium;
  font-style: italic;
  font-weight: bolder;
}
.phoneCall,
.link2 a {
  font-family: "Roboto", sans-serif;
  font-size: medium;
  font-style: italic;
  font-weight: bolder;
}
.blue-text{
  color: dodgerblue;
}
</style>`;

exports.verificationEmailTemplate = (name, otp) => {
  const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- <link rel="stylesheet" href="index.css" /> -->
    <link
      href="https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Noto+Sans&family=Roboto:ital,wght@1,300&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Noto+Sans&family=Roboto:ital,wght@1,300&family=Source+Sans+Pro:ital@1&display=swap"
      rel="stylesheet"
    />
    ${cssStyle}
  </head>
  <body>
    <div class="container">
      <div class="box">
        <h2><p class="heading">Verification Email</p></h2>
        <div class="details">
          <p class="greeting">Dear ${name},</p>
          <p class="greetingWillinker">
            Greetings from IOM!
          </p>
          <p class="salutaion">
            Thank you for registering in IOM.
          </p>
          <p class="checkLink">
            Please verify your email by mentioning the OTP on the verification page.
          </p>
          <p class="linkVerify">
          OTP: <span class="blue-text">${otp}</span>
          </p>
          <p class="textBody">
            It is important for you to verify your email, by doing so you
            confirm that this email belongs to you. It is only after you have
            verified your email you can access your account and complete your
            order.
          </p>
          <p class="wish">
            All the Best!!,<br />
            <br />
          </p>
          <p class="wish">
            [NOTE: This is a system generated message. Please DO NOT REPLY.]
          </p>
        </div>
     </div>
      </div>
     
  </body>
</html>
`;
  return template;
};

exports.orderPlaced = (name, order_id) => {
  const template = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <!-- <link rel="stylesheet" href="index.css" /> -->
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Noto+Sans&family=Roboto:ital,wght@1,300&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Noto+Sans&family=Roboto:ital,wght@1,300&family=Source+Sans+Pro:ital@1&display=swap"
        rel="stylesheet"
      />
    </head>
    <body>
    <p>Hi ${name},<p> </br>
    <p>Your order with <span style="color: #25468a;"> ID: ${order_id} </span> placed successfully!<p> </br>

    <p>Thanks for ordering!<p>
    </body>
    `;
  return template;
};

exports.pickupScheduled = (name, order_id, datetime) => {
  const template = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <!-- <link rel="stylesheet" href="index.css" /> -->
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Noto+Sans&family=Roboto:ital,wght@1,300&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Noto+Sans&family=Roboto:ital,wght@1,300&family=Source+Sans+Pro:ital@1&display=swap"
        rel="stylesheet"
      />
    </head>
    <body>
    <p>Hi ${name},<p> </br>
    <p>Pickup scheduled for your order id: <span style="color: #25468a;"> ${order_id} on ${datetime}! </span> <p> </br>

    <p>Thanks for ordering!<p>
    </body>
    `;
  return template;
};

exports.contactusQuery = (name, email, message) => {
  const template = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <!-- <link rel="stylesheet" href="index.css" /> -->
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Noto+Sans&family=Roboto:ital,wght@1,300&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Noto+Sans&family=Roboto:ital,wght@1,300&family=Source+Sans+Pro:ital@1&display=swap"
        rel="stylesheet"
      />
    </head>
    <body>
    <p>Query from ${name} (${email}),<p> </br>

    </br>
    <div>${message}<div>
    </body>
    `;
  return template;
};


exports.resetPasswordEmail = (name) => {
  const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- <link rel="stylesheet" href="index.css" /> -->
    <link
      href="https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Noto+Sans&family=Roboto:ital,wght@1,300&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Noto+Sans&family=Roboto:ital,wght@1,300&family=Source+Sans+Pro:ital@1&display=swap"
      rel="stylesheet"
    />
    ${cssStyle}
  </head>
  <body>

    <div class="container">
      <div class="box">
        <h2><p class="heading">Password reset link</p></h2>
        <div class="details">
          <p class="greeting">Dear ${name},</p>
        
          <p class="checkLink">
 Click on below link to reset your password
          </p>
        
         
          <p><a href=" http://localhost:3001/user/forgot-password ">Reset password</a></p>
          <p class="wish">
            [NOTE: This is a system generated message. Please DO NOT REPLY.]
          </p>
        </div>
     </div>
      </div>
     
  </body>
</html>
`;
  return template;
};