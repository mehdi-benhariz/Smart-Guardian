const Joi = require("joi");

exports.EmployeeValidator = Joi.object({
  fullName: Joi.string().required().min(3).max(50),
  CIN: Joi.string().required().length(8),
  password: Joi.string().required().min(6),
});
module.exports = { Joi };
