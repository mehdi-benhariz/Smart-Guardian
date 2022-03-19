const Employee = require("../models/Employee");
const safeCompare = require("safe-compare");
const { generateQRCode } = require("../utils/images");
const { getUserByToken } = require("../utils/auth");
const { redisClient } = require("../loaders/database");

const checkLoginData = async (req, res, next) => {
  let errors = [];
  if (!req.body.CIN) errors.push({ msg: "Please enter your CIN" });
  if (!req.body.password) errors.push({ msg: "Please enter password" });
  return errors;
};
//params : CIN ,password
//
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
//
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
//
exports.getQRCode = async (req, res) => {
  try {
    const employee = await getUserByToken(req.cookies?.token);

    if (!employee)
      return res.status(404).send({
        message: "Employee not found with CIN " + req.body.CIN,
      });
    //*generate a token
    const token = await require("crypto").randomBytes(48).toString("hex");
    const qrCode = JSON.stringify({
      CIN: employee.CIN,
      token,
    });
    console.log(qrCode);
    generateQRCode(qrCode, employee.CIN.toString());
    //*store the data in cache
    const chacheRes = await redisClient.set(employee.CIN, token);
    console.log(chacheRes);
    res
      .status(200)
      .send({ success: true, message: "qrcode created successfully" });
  } catch (e) {
    res.status(500).send(e.message);
  }
};
//param: CIN , token
exports.validateQRCode = async (req, res) => {
  try {
    const { CIN, token } = req.body;
    if (!CIN || !token)
      return res.status(400).send({ message: `CIN or token are not valid` });

    const employee = await Employee.findOne({ CIN });
    if (!employee)
      return res.status(404).send({
        message: `Employee not found with CIN: ${CIN}`,
      });
    const realToken = await redisClient.get(CIN);
    //
    if (safeCompare(token, realToken)) {
      //todo change the date format
      addPresence({ CIN, date: new Date() });
      redisClient.del(CIN);
      return res.status(200).json({ success: true, message: "welcome" });
    }
    return res.status(300).json({ success: false, message: "invalide code!" });
  } catch (e) {
    res.status(500).send(e.message);
  }
};
