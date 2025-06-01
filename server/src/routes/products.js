const express = require('express');
const pool = require('../db');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRole = require('../middleware/authorizeRole');
const router = express.Router();

// Protect all product routes (authentication required)
router.use(authenticateJWT);

// Get all products with category and supplier names
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.category_Name, s.supplier_Company
       FROM product p
       LEFT JOIN category c ON p.category_ID = c.category_ID
       LEFT JOIN supplier s ON p.supplier_ID = s.supplier_ID`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Add a product
router.post('/', authenticateJWT, authorizeRole(['Admin', 'SuperAdmin']), async (req, res) => {
  const { product_Name, category_ID, supplier_ID, price, product_Quantity } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO product (product_Name, category_ID, supplier_ID, price, product_Quantity) VALUES (?, ?, ?, ?, ?)',
      [product_Name, category_ID, supplier_ID, price, product_Quantity]
    );
    res.json({ product_ID: result.insertId, product_Name, category_ID, supplier_ID, price, product_Quantity });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Update a product
router.put('/:id', authenticateJWT, authorizeRole(['SuperAdmin', 'Admin']), async (req, res) => {
  const { id } = req.params;
  const { product_Name, category_ID, supplier_ID, price, product_Quantity } = req.body;
  try {
    await pool.query(
      'UPDATE product SET product_Name = ?, category_ID = ?, supplier_ID = ?, price = ?, product_Quantity = ? WHERE product_ID = ?',
      [product_Name, category_ID, supplier_ID, price, product_Quantity, id]
    );
    res.json({ product_ID: id, product_Name, category_ID, supplier_ID, price, product_Quantity });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Delete a product
router.delete('/:id', authenticateJWT, authorizeRole(['Admin','SuperAdmin']), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM product WHERE product_ID = ?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;