const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: "AKIAQKHCC4PIS2YE3V5F",
  secretAccessKey: "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",
  region: "ap-south-1",
});

module.exports = new AWS.S3();
