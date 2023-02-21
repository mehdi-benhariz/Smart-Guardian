const employeeRoute = require("../routes/employee");
const adminRoute = require("../routes/admin");
module.exports = (app) => {
  app.use("/api/v1/employee", employeeRoute);
  app.use("/api/v1/admin", adminRoute);
};
