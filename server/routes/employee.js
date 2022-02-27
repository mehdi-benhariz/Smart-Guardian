const router = require("express").Router();

const employeeController = require("../Controllers/employee");

router.post("/login", employeeController.login);

module.exports = router;
