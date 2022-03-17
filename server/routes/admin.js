router = require("express").Router();
const { checkAdmin } = require("../middleware/auth");
const adminController = require("../Controllers/admin");

router.get("/", adminController.getEmployeesPresence);
router.get("/all-employees", checkAdmin, adminController.getAllEmployees);
router.get("/get-file", adminController.downloadEmployeesPresence);
router.post("/add-employee", checkAdmin, adminController.addEmployee);
router.delete("/delete-employee/:id", adminController.deleteEmployee);
router.get("/:id", adminController.getEmployeePresence);
module.exports = router;
