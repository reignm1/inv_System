const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all purchase orders
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM purchase_orders');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Add a purchase order
router.post('/', async (req, res) => {
  const { supplier_ID, product_ID, quantity_Ordered, order_Date, unit_Price, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO purchase_orders (supplier_ID, product_ID, quantity_Ordered, order_Date, unit_Price, status) VALUES (?, ?, ?, ?, ?, ?)',
      [supplier_ID, product_ID, quantity_Ordered, order_Date, unit_Price, status]
    );
    res.json({ order_ID: result.insertId, supplier_ID, product_ID, quantity_Ordered, order_Date, unit_Price, status });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Update a purchase order
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { supplier_ID, product_ID, quantity_Ordered, order_Date, unit_Price, status } = req.body;
  try {
    await pool.query(
      'UPDATE purchase_orders SET supplier_ID = ?, product_ID = ?, quantity_Ordered = ?, order_Date = ?, unit_Price = ?, status = ? WHERE order_ID = ?',
      [supplier_ID, product_ID, quantity_Ordered, order_Date, unit_Price, status, id]
    );
    res.json({ order_ID: id, supplier_ID, product_ID, quantity_Ordered, order_Date, unit_Price, status });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Delete a purchase order
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM purchase_orders WHERE order_ID = ?', [id]);
    res.json({ message: 'Purchase order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;