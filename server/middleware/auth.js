const { getUserByToken } = require("../utils/auth");
exports.checkEmployee = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  // Set token from cookie
  else if (req.cookies.token) token = req.cookies.token;

  const employee = await getUserByToken(token);
  if (!employee) {
    return res.status(401).json({
      message: "Access denied. You are not authorized to perform this action.",
    });
  }
  req.body = {
    ...req.body,
    user: employee,
  };
  next();
};
exports.checkAdmin = async (req, res, next) => {
  await this.checkEmployee(req, res, async () => {
    const employee = await Employee.findById(req.body.user._id);

    if (!employee.isAdmin) {
      return res.status(401).json({
        message:
          "Access denied. You are not authorized to perform this action.",
      });
    }

    next();
  });
};
