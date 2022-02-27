const Employee = require("../models/Employee");
const ObjectId = require("mongodb").ObjectId;

const checkData = async (req, res, next) => {
  let errors = [];
  if (!req.body.fullName) errors.push({ msg: "Please enter name" });
  if (!req.body.password) errors.push({ msg: "Please enter password" });
  if (!req.body.CIN) errors.push({ msg: "Please enter CIN" });
  return errors;
};

exports.addEmployee = async (req, res) => {
  const errors = await checkData(req, res);
  if (errors.length > 0)
    return res.status(400).json({
      errors,
    });
  const employee = new Employee(req.body);
  try {
    await employee.save();
    res.status(201).send({
      message: "Employee added successfully",
      employee,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

exports.getAllEmployees = async (req, res) => {
  console.log("getAllEmployees");
  try {
    const employees = await Employee.find({
      isRestricted: false,
      isAdmin: false,
    });
    res.status(200).send({
      message: "Employees fetched successfully",
      employees,
    });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.deleteEmployee = async (req, res) => {
  //verify id
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(404).send("Invalid id");
  try {
    const employee = await Employee.findOne({
      id,
      isRestricted: false,
      isAdmin: false,
    });
    console.log(employee);
    if (!employee) {
      return res.status(404).send({
        message: "Employee not found with id " + req.params.id,
      });
    }
    employee.isRestricted = true;
    await employee.save();

    res.status(200).send({
      message: "Employee deleted successfully",
    });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.searchEmployee = async (req, res) => {
  const search = req.params.search;
  try {
    const employees = await Employee.find({
      isRestricted: false,
      isAdmin: false,
      fullName: { $regex: search, $options: "i" },
    });
    res.status(200).send({
      message: "Employees fetched successfully",
      employees,
    });
  } catch (e) {
    res.status(500).send(e);
  }
};
