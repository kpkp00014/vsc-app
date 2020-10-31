const express = require("express");
const moment = require("moment");
const Project = require("../../models/proejct.js");
const User = require("../../models/user.js");
const Item = require("../../models/item.js");
const { AWS_KEY, AWS_PRIVATE_KEY } = require("../../config/index.js");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: AWS_KEY,
  secretAccessKey: AWS_PRIVATE_KEY,
  region: "ap-northeast-2",
});

const router = express.Router();

// GET  api/project
router.get("/", (req, res) => {
  console.log("hi there");
  res.send("hello world!");
});

module.exports = router;
