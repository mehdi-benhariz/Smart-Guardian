const router = require("express").Router();
const { checkEmployee } = require("../middleware/auth");
const employeeController = require("../Controllers/employee");
const adminController = require("../Controllers/admin");
router.post("/login", employeeController.login);
router.post("/logout", checkEmployee, employeeController.logout);
router.get("/getQR", checkEmployee, employeeController.getQRCode);
router.post("/validateQR", employeeController.validateQRCode);
router.get(
  "/getPresence/:id",
  checkEmployee,
  adminController.getEmployeePresence
);
module.exports = router;
