const Employee = require("../models/Employee");

const checkLoginData = async (req, res, next) => {
  let errors = [];
  if (!req.body.CIN) errors.push({ msg: "Please enter your CIN" });
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
    console.log({ token });
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    // in production, we want to set secure: true.
    if (process.env.NODE_ENV === "production") options.secure = true;

    res.status(200).cookie("token", token, options).json({
      success: true,
      token,
      employee,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

exports.logout = async (req, res) => {
  try {
    res.status(200).clearCookie("token").json({
      message: "Logout successful",
      success: true,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};
exports.validatePresence = async (req, res) => {
  try {
    let employee = await Employee.findOne({});
    //switch presence to true
    //write to excel sheet
  } catch (error) {}
};
