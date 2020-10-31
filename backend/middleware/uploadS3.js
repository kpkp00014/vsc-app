const moment = require("moment");
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { AWS_KEY, AWS_PRIVATE_KEY } = require("../config");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: AWS_KEY,
  secretAccessKey: AWS_PRIVATE_KEY,
  region: "ap-northeast-2",
});

// upload middleware
const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "xcezsimplestorage",
    acl: "public-read",
    key(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, req.user.id + "/" + moment().format("YYYYMMDDhhmmss") + ext);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
});

module.exports = uploadS3;
