const router = require("express").Router();
const { checkEmployee } = require("../middleware/auth");
const employeeController = require("../Controllers/employee");

router.post("/login", employeeController.login);
router.post("/logout", checkEmployee, employeeController.logout);
router.get("/getQR", checkEmployee, employeeController.getQRCode);
router.post("/validateQR", employeeController.validateQRCode);
module.exports = router;
