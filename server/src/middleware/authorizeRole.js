function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    // req.user should be set by your JWT authentication middleware
    if (!req.user || !allowedRoles.includes(req.user.user_Role)) {
      return res.status(403).json({ message: 'Access Denied' });
    }
    next();
  };
}

module.exports = authorizeRole;