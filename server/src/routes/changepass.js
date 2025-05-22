const express = require('express');
const bcrypt = require('bcrypt');
const authenticateJWT = require('../middleware/authenticateJWT');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Replace with your actual user model or DB logic
const getUserById = async (id) => { /* ... */ };
const updateUserPassword = async (id, hash) => { /* ... */ };

const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many password change attempts, please try again later.'
});

router.put('/users/:id/password', passwordChangeLimiter, authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  // Only allow user to change their own password or if admin
  if (req.user.user_ID !== id && req.user.user_Role !== 'Admin' && req.user.user_Role !== 'SuperAdmin') {
    return res.status(403).json({ message: 'Access denied.' });
  }

  const user = await getUserById(id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const valid = await bcrypt.compare(oldPassword, user.user_PasswordHash);
  if (!valid) return res.status(400).json({ message: 'Current password is incorrect.' });

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters.' });
  }

  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!strongPassword.test(newPassword)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await updateUserPassword(id, newHash);

  console.log(`User ${id} attempted password change at ${new Date().toISOString()}`);

  res.json({ message: 'Password updated successfully.' });
});

module.exports = router;