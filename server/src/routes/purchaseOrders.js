const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all purchase orders
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM purchaseorder');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Add a purchase order
router.post('/', async (req, res) => {
  const { supplier_ID, order_Date, quantity_Ordered, unit_Price, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO PurchaseOrder (supplier_ID, order_Date, quantity_Ordered, unit_Price, status) VALUES (?, ?, ?, ?, ?)',
      [supplier_ID, order_Date, quantity_Ordered, unit_Price, status]
    );
    res.json({ purchase_OrderID: result.insertId, supplier_ID, order_Date, quantity_Ordered, unit_Price, status });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Update a purchase order
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { supplier_ID, order_Date, quantity_Ordered, unit_Price, status } = req.body;
  try {
    await pool.query(
      'UPDATE purchaseorder SET supplier_ID = ?, order_Date = ?, quantity_Ordered = ?, unit_Price = ?, status = ? WHERE purchase_OrderID = ?',
      [supplier_ID, order_Date, quantity_Ordered, unit_Price, status, id]
    );
    res.json({ purchase_OrderID: id, supplier_ID, order_Date, quantity_Ordered, unit_Price, status });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Delete a purchase order
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM purchaseorder WHERE purchase_OrderID = ?', [id]);
    res.json({ message: 'Purchase order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;