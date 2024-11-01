const isAdmin = (req, res, next) => {
  try {
    if (req.user && (req.user.role == "admin" || req.user.role == "vip")) {
        return next();
    }
    res.code = 403;
    throw new Error("Unauthorized Access");
  } catch (error) {
    next(error);
  }
};

module.exports = isAdmin;
