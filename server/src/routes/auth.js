const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db');
const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'secretkey';

// Helper: get user by username
async function getUserByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE user_Username = ?', [username]);
  return rows[0];
}

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE user_Username = ?', [username]);
  const user = rows[0];
  console.log('Fetched user:', user); // Check this output in your terminal!
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.user_Password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const payload = {
    user_ID: user.user_ID,
    user_Username: user.user_Username,
    user_Role: user.user_Role
  };

  const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });
  res.json({ token, user: payload });
});

module.exports = router;