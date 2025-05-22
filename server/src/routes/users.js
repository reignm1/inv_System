const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Add a user (make sure to hash password in real apps)
router.post('/', async (req, res) => {
  const { user_FirstName, user_LastName, user_MiddleName, user_Address, user_Contact, user_Username, user_Password, user_Role} = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO users (user_FirstName, user_LastName, user_MiddleName, user_Address, user_Contact, user_Username, user_PasswordHash, user_Role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user_FirstName, user_LastName, user_MiddleName, user_Address, user_Contact, user_Username, user_Password, user_Role]
    );
    res.json({ user_ID: result.insertId, user_FirstName, user_LastName, user_MiddleName, user_Address, user_Contact, user_Username, user_Role});
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Update a user (except password)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_FirstName, user_LastName, user_MiddleName, user_Address, user_Contact, user_Username, user_Role } = req.body;
  try {
    await pool.query(
      'UPDATE users SET user_FirstName = ?, user_LastName = ?, user_MiddleName = ?, user_Address = ?, user_Contact = ?, user_Username = ?, user_Role = ?, user_Email = ? WHERE user_ID = ?',
      [user_FirstName, user_LastName, user_MiddleName, user_Address, user_Contact, user_Username, user_Role, id]
    );
    res.json({ user_ID: id, user_FirstName, user_LastName, user_MiddleName, user_Address, user_Contact, user_Username, user_Role });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE user_ID = ?', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;