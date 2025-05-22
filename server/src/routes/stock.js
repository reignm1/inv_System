const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all stock entries
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM stock');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Add a stock entry
router.post('/', async (req, res) => {
  const { product_ID, stock_Quantity, last_RestockDate } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO stock (product_ID, stock_Quantity, last_RestockDate) VALUES (?, ?, ?)',
      [product_ID, stock_Quantity, last_RestockDate]
    );
    res.json({ stock_ID: result.insertId, product_ID, stock_Quantity, last_RestockDate });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Update a stock entry
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { product_ID, stock_Quantity, last_RestockDate } = req.body;
  try {
    await pool.query(
      'UPDATE stock SET product_ID = ?, stock_Quantity = ?, last_RestockDate = ? WHERE stock_ID = ?',
      [product_ID, stock_Quantity, last_RestockDate, id]
    );
    res.json({ stock_ID: id, product_ID, stock_Quantity, last_RestockDate });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Delete a stock entry
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM stock WHERE stock_ID = ?', [id]);
    res.json({ message: 'Stock entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;