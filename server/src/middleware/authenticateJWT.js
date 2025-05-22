const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secretkey';

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });
      req.user = user; // user object should include user_Role
      next();
    });
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
}

module.exports = authenticateJWT;