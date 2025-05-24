const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secretkey';

function authenticateJWT(req, res, next) {
  console.log('=== JWT Authentication Debug ===');
  console.log('Headers:', req.headers);
  
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader);
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);
    
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        console.log('JWT verification error:', err);
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      console.log('Decoded user from JWT:', user);
      
      req.user = {
        ...user,
        role: user.user_Role || user.role // fallback
      };
      
      console.log('Final req.user set:', req.user);
      console.log('=== End JWT Debug ===');
      next();
    });
  } else {
    console.log('No Bearer token found in header');
    console.log('=== End JWT Debug ===');
    res.status(401).json({ message: 'No token provided' });
  }
}

module.exports = authenticateJWT;