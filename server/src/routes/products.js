const express = require('express');
const pool = require('../db');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRole = require('../middleware/authorizeRole');
const productsController = require('../controllers/productsController');

// Get all products
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE product_ID = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Add a product
router.post('/', async (req, res) => {
  const { product_Name, category_ID, supplier_ID, price, product_Quantity } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO products (product_Name, category_ID, supplier_ID, price, product_Quantity) VALUES (?, ?, ?, ?, ?)',
      [product_Name, category_ID, supplier_ID, price, product_Quantity]
    );
    res.json({ product_ID: result.insertId, product_Name, category_ID, supplier_ID, price, product_Quantity });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { product_Name, category_ID, supplier_ID, price, product_Quantity } = req.body;
  try {
    await pool.query(
      'UPDATE products SET product_Name = ?, category_ID = ?, supplier_ID = ?, price = ?, product_Quantity = ? WHERE product_ID = ?',
      [product_Name, category_ID, supplier_ID, price, product_Quantity, id]
    );
    res.json({ product_ID: id, product_Name, category_ID, supplier_ID, price, product_Quantity });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE product_ID = ?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Only Admins and SuperAdmins can delete users
router.delete('/users/:id', authenticateJWT, authorizeRole('Admin', 'SuperAdmin'), async (req, res) => {
  // ...delete logic...
});

module.exports = router;