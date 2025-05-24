function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    console.log('=== Role Authorization Debug ===');
    console.log('req.user:', req.user);
    console.log('allowedRoles:', allowedRoles);
    
    const userRole = req.user?.user_Role || req.user?.role;
    console.log('Extracted userRole:', userRole);
    
    // Flatten the allowedRoles if necessary
    const flatAllowedRoles = allowedRoles.flat();
    console.log('Role check result:', flatAllowedRoles.includes(userRole));
    
    if (!req.user || !flatAllowedRoles.includes(userRole)) {
      console.log('Access denied - req.user exists:', !!req.user);
      console.log('Access denied - role allowed:', flatAllowedRoles.includes(userRole));
      console.log('=== End Role Debug ===');
      return res.status(403).json({ message: 'Access Denied' });
    }
    
    console.log('Access granted');
    console.log('=== End Role Debug ===');
    next();
  };
}

module.exports = authorizeRole;