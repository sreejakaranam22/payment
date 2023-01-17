const mailer = require("nodemailer");
const config = require("../../config/env.config");

const templates = require("./templates");

const sendEmail = async (options) => {
  const transporter = mailer.createTransport({
    host: config.email.SMTP_HOST,
    port: config.email.SMTP_PORT,
    starttls: {
      enable: true,
    },
    secureConnection: true,
    secure: true,
    auth: {
      user: config.email.SMTP_EMAIL,
      pass: config.email.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${config.email.SMTP_FROM_NAME} <${config.email.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };
  await transporter.sendMail(message);
};

exports.emailVerification = async (name, email, otp) => {
  // call sendEmail
  await sendEmail({
    email: email,
    subject: "IOM - Email Verification",
    html: templates.verificationEmailTemplate(name, otp),
  });
};


exports.resetPassword = async (name, email, fullname) => {
  await sendEmail({
    email: email,
    subject: "Reset Password",
    html: templates.resetPasswordEmail(name),
  });
};



exports.orderPlaced = async (name, email, order_id) => {
  await sendEmail({
    email: email,
    subject: "IOM - Order Placed",
    html: templates.orderPlaced(name, order_id),
  });
};

exports.pickupScheduled = async (name, email, order_id, datetime) => {
  await sendEmail({
    email: email,
    subject: "IOM - Pickup Scheduled",
    html: templates.pickupScheduled(name, order_id, datetime),
  });
};

exports.contactusQuery = async (name, email, fullname) => {
  await sendEmail({
    email: "better@iombio.com",
    subject: `Contact Us - Query from ${name}`,
    html: templates.contactusQuery(name, email, fullname),
  });
};



