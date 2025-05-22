// This script creates an admin user in the database.
//run "node createAdmin.js" in server/src
const bcrypt = require('bcrypt');
const pool = require('./db');

async function createAdmin() {
  const username = 'admin';
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);

  // Adjust these fields to match your users table structure
  const user = {
    user_FirstName: 'Admin',
    user_LastName: 'User',
    user_MiddleName: '',
    user_Address: '',
    user_Contact: '',
    user_Username: username,
    user_Password: hash,
    user_Role: 'Admin',
  };

  try {
    const [result] = await pool.query(
      `INSERT INTO users 
      (user_FirstName, user_LastName, user_MiddleName, user_Address, user_Contact, user_Username, user_Password, user_Role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.user_FirstName,
        user.user_LastName,
        user.user_MiddleName,
        user.user_Address,
        user.user_Contact,
        user.user_Username,
        user.user_Password,
        user.user_Role,
      ]
    );
    console.log('Admin user created with ID:', result.insertId);
  } catch (err) {
    console.error('Error inserting admin user:', err.message);
  } finally {
    pool.end();
  }
}

createAdmin();