const Employee = require("../models/Employee");

const checkLoginData = async (req, res, next) => {
  let errors = [];
  if (!req.body.email) errors.push({ msg: "Please enter email" });
  if (!req.body.password) errors.push({ msg: "Please enter password" });
  return errors;
};

exports.login = async (req, res) => {
  const errors = await checkLoginData(req, res);
  if (errors.length > 0)
    return res.status(400).json({
      errors,
    });

  const { CIN, password } = req.body;
  try {
    const employee = await Employee.findOne({
      CIN,
      isRestricted: false,
    });
    if (!employee)
      return res.status(404).send({
        message: "Employee not found with CIN " + CIN,
      });
    const isMatch = await employee.matchPassword(password);

    if (!isMatch)
      return res.status(401).send({
        message: "Wrong password",
      });
    const token = employee.getSignedJwtToken();

    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      message: "Login successful",
      success: true,
      token,
      employee,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};
