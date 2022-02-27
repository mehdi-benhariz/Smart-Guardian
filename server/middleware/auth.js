const checkEmployee = async (req, res, next) => {
  const employee = await Employee.findById(req.user.id);
  if (!employee) {
    return res.status(401).json({
      message: "Access denied. You are not authorized to perform this action.",
    });
  }
  next();
};
const checkAdmin = async (req, res, next) => {
  const employee = await Employee.findById(req.user.id);
  if (!employee.isAdmin) {
    return res.status(401).json({
      message: "Access denied. You are not authorized to perform this action.",
    });
  }
  next();
};
