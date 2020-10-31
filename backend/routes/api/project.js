const express = require("express");
const moment = require("moment");
const auth = require("../../middleware/auth.js");
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

// @route   POST    api/project/init
// @desc    init new project
// @access  Public
router.post("/init", auth, async (req, res) => {
  try {
    const newProject = await Project.create({
      name: req.body.pName,
      owner: req.user.id,
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        projects: newProject._id,
      },
    });
    res.json({
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
});

// @route   GET    api/project/list
// @desc    get project list
// @access  Public
router.get("/list", auth, async (req, res) => {
  const projectFindResult = await User.findById(req.user.id).populate({
    path: "projects",
  });
  const result = projectFindResult.projects;
  res.json(result);
});

// @route   POST    api/project/item
// @desc    get project item list
// @access  Public
router.post("/item", auth, async (req, res) => {
  const { project } = req.body;
  const projectFindResult = await Project.findById(project).populate({
    path: "items",
  });
  const result = projectFindResult.items;
  res.json(result);
});

// @route   POST    api/project/add
// @desc    add project item
// @access  Public
router.post("/add", auth, async (req, res) => {
  const { project, content, isImage } = req.body;
  const newItem = await Item.create({
    owner: req.user.id,
    isImage: isImage,
    content: content,
    project: project,
  });
  await User.findByIdAndUpdate(req.user.id, {
    $push: {
      items: newItem._id,
    },
  });
  await Project.findByIdAndUpdate(project, {
    $push: {
      items: newItem._id,
    },
  });
  const projectFindResult = await Project.findById(project).populate({
    path: "items",
  });
  const result = projectFindResult.items;
  res.json(result);
});

// @route   POST    api/project/terminate
// @desc    delete project
// @access  Public
router.post("/terminate", auth, async (req, res) => {
  const { project } = req.body;
  const projectInfo = await Project.findById(project).populate({
    path: "items",
  });
  if (projectInfo.owner == req.user.id) {
    await Item.deleteMany({ project: project });
    await Project.findByIdAndDelete(project);
    await User.findByIdAndUpdate(req.user.id, {
      $pull: {
        projects: project,
      },
    });
    res.json({ success: true });
  } else {
    // 프로젝트의 소유자가 요청자가 아닌 경우
    res.status(400).json({ msg: "잘못된 요청입니다." });
  }
});

// @route   POST    api/project/delete
// @desc    delete project item
// @access  Public
router.post("/delete", auth, async (req, res) => {
  const { project, content } = req.body;
  const itemFind = await Item.findById(content);
  if (itemFind.owner == req.user.id) {
    await Item.findByIdAndDelete(content);
    await Project.findByIdAndUpdate(project, {
      $pull: {
        items: content,
      },
    });
    const projectFindResult = await Project.findById(project).populate({
      path: "items",
    });
    const result = projectFindResult.items;
    res.json(result);
  } else {
    res.status(400).json({ msg: "잘못된 요청입니다." });
  }
});

// @route   POST    api/project/export
// @desc    export project
// @access  Public
router.post("/export", auth, async (req, res) => {
  console.log("export 요청");
  res.json({ success: true });
});

module.exports = router;
