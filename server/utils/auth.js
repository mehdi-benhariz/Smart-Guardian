const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

exports.getUserByToken = async (token) => {
  if (!token) return null;
  const decode = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await Employee.findById(decode.id);
  return user;
};
