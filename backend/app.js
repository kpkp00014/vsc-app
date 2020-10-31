const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/index.js");
const hpp = require("hpp");
const cors = require("cors");
const helmet = require("helmet");
const projectRoutes = require("./routes/api/project.js");

const app = express();
const { MONGO_URI } = config;

//서버의 보안을 보완해줌
app.use(hpp());
app.use(helmet());

// 크로스도메인 허용
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

/*               라우터                 */
app.get("/");
app.use("/api/project", projectRoutes);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB connecting Success!!"))
  .catch((e) => console.log(e));

module.exports = app;
