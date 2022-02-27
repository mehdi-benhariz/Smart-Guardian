const cors = require("cors");
// const errorHandler = require("../middleware/errorHandler");
const express = require("express");
// const fileUploader = require("express-fileupload");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const { errorHandler } = require("../middleware/errorHandler");
require("express-async-errors");

const employeeRoute = require("../routes/employee");
const adminRoute = require("../routes/admin");

module.exports = (app) => {
  //   app.use("/static", express.static(path.join(__dirname, "..", "public")));
  app.use(cors());
  //   app.use(errorHandler);
  app.use(express.json());
  //app.use(fileUploader()); // File uploader middleware
  app.use(helmet());
  app.use(morgan("tiny"));
  app.use("/api/v1/employee", employeeRoute);
  app.use("/api/v1/admin", adminRoute);
};
