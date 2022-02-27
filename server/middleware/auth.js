const { getUserByToken } = require("../utils/auth");
exports.checkEmployee = async (req, res, next) => {
  const employee = await getUserByToken(req.cookies?.token);
  if (!employee) {
    return res.status(401).json({
      message: "Access denied. You are not authorized to perform this action.",
    });
  }
  req.body;
  next();
};
exports.checkAdmin = async (req, res, next) => {
  const employee = await Employee.findById(req.user.id);
  if (!employee.isAdmin) {
    return res.status(401).json({
      message: "Access denied. You are not authorized to perform this action.",
    });
  }
  next();
};
