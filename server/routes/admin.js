router = require("express").Router();

const adminController = require("../Controllers/admin");

router.get("/all-employees", adminController.getAllEmployees);
router.post("/add-employee", adminController.addEmployee);
router.delete("/delete-employee/:id", adminController.deleteEmployee);

router.get("/test", () => console.log("test"));
module.exports = router;
