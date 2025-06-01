const express = require('express');
const pool = require('../db');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRole = require('../middleware/authorizeRole');
const router = express.Router();

// GET all stock entries with joined product, category, supplier details
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const query = `
      SELECT 
        s.stock_ID, 
        s.product_ID, 
        s.stock_Quantity, 
        s.last_RestockDate, 
        p.product_Name, 
        c.category_Name, 
        sup.supplier_Company
      FROM stock s
      INNER JOIN product p ON s.product_ID = p.product_ID
      INNER JOIN category c ON p.category_ID = c.category_ID
      INNER JOIN supplier sup ON p.supplier_ID = sup.supplier_ID;
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// POST add new stock or update existing stock quantity and restock date
router.post('/', authenticateJWT, authorizeRole('SuperAdmin', 'Admin'), async (req, res) => {
  const { product_ID, stock_Quantity, last_RestockDate } = req.body;
  try {
    const query = `
      INSERT INTO stock (product_ID, stock_Quantity, last_RestockDate)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        stock_Quantity = stock_Quantity + VALUES(stock_Quantity), 
        last_RestockDate = VALUES(last_RestockDate);
    `;
    const [result] = await pool.query(query, [product_ID, stock_Quantity, last_RestockDate]);
    res.json({ message: 'Stock added/updated successfully.', stock_ID: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// PUT update existing stock by stock_ID
router.put('/:id', authenticateJWT, authorizeRole('SuperAdmin' , 'Admin'), async (req, res) => {
  const { id } = req.params;
  const { stock_Quantity, last_RestockDate } = req.body;
  try {
    const query = `
      UPDATE stock 
      SET stock_Quantity = ?, last_RestockDate = ? 
      WHERE stock_ID = ?;
    `;
    await pool.query(query, [stock_Quantity, last_RestockDate, id]);
    res.json({ message: 'Stock updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// DELETE a stock entry by stock_ID
router.delete('/:id', authenticateJWT, authorizeRole('SuperAdmin', 'Admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const query = `DELETE FROM stock WHERE stock_ID = ?;`;
    await pool.query(query, [id]);
    res.json({ message: 'Stock deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;
