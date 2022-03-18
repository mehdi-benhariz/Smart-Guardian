router = require("express").Router();
const { checkAdmin } = require("../middleware/auth");
const adminController = require("../Controllers/admin");

router.get("/", checkAdmin, adminController.getEmployeesPresence);
router.get("/all-employees", checkAdmin, adminController.getAllEmployees);
router.get("/get-file", checkAdmin, adminController.downloadEmployeesPresence);
router.post("/add-employee", checkAdmin, adminController.addEmployee);
router.delete(
  "/delete-employee/:id",
  checkAdmin,
  adminController.deleteEmployee
);
router.get("/:id", checkAdmin, adminController.getEmployeePresence);
module.exports = router;
