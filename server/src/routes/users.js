const express = require('express');
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRole = require('../middleware/authorizeRole');
const router = express.Router();

// Get all users 
router.get('/', authenticateJWT, (req, res) => {
  db.query('SELECT user_ID, user_Username, user_FirstName, user_Role FROM Users') , (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    res.json(results);
  }
});

// Add a user (hash password) (SuperAdmin Only)
router.post('/', authenticateJWT, authorizeRole('SuperAdmin'), async (req, res) => {
  const { user_FirstName, user_LastName, user_MiddleName, user_Address, user_Contact, user_Username, user_Password, user_Role } = req.body;
  
  const hashedPassword = await bcrypt.hash(user_Password, 10);
  db.query(
   'INSERT INTO users (user_FirstName, user_LastName, user_MiddleName, user_Address, user_Contact, user_Username, user_Password, user_Role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [user_FirstName, user_LastName, user_MiddleName, user_Address, user_Contact, user_Username, hashedPassword, user_Role],
    );
    (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    res.json({ message: 'User created successfully' , id: result.insertId});
    
  }  
});

// Update a user (except password) (SuperAdmin Only)
router.put('/:id', authenticateJWT, authorizeRole('SuperAdmin'), (req, res) => {  
  const { user_FirstName, user_LastName, user_MiddleName, user_Address, user_Contact, user_Username, user_Role } = req.body;
  db.query(
    'UPDATE users SET user_FirstName = ?, user_LastName = ?, user_MiddleName = ?, user_Address = ?, user_Contact = ?, user_Username = ?, user_Role = ? WHERE user_ID = ?',
    [user_FirstName, user_LastName, user_MiddleName, user_Address, user_Contact, user_Username, user_Role, id],
     (err) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err.message });
      res.json({ message: 'User updated Successfully'});
    }
  );
});

// Delete a user (SuperAdmin Only)
router.delete('/:id', authenticateJWT, authorizeRole('SuperAdmin'), (req, res) => {
  db.query('DELETE FROM users WHERE user_ID = ?'), [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    res.json({ message: 'User deleted' });  
  }
});

module.exports = router;