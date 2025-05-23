const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM supplier');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Get a supplier by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM supplier WHERE supplier_ID = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Supplier not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Add a supplier
router.post('/', async (req, res) => {
  const { supplier_Company, contact_Person, supplier_ContactNumber, supplier_Email, supplier_Address } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO supplier (supplier_Company, contact_Person, supplier_ContactNumber, supplier_Email, supplier_Address) VALUES (?, ?, ?, ?, ?)',
      [supplier_Company, contact_Person, supplier_ContactNumber, supplier_Email, supplier_Address]
    );
    res.json({ supplier_ID: result.insertId, supplier_Company, contact_Person, supplier_ContactNumber, supplier_Email, supplier_Address });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Update a supplier
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { supplier_Company, contact_Person, supplier_ContactNumber, supplier_Email, supplier_Address } = req.body;
  try {
    await pool.query(
      'UPDATE supplier SET supplier_Company = ?, contact_Person = ?, supplier_ContactNumber = ?, supplier_Email = ?, supplier_Address = ? WHERE supplier_ID = ?',
      [supplier_Company, contact_Person, supplier_ContactNumber, supplier_Email, supplier_Address, id]
    );
    res.json({ supplier_ID: id, supplier_Company, contact_Person, supplier_ContactNumber, supplier_Email, supplier_Address });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Delete a supplier
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM supplier WHERE supplier_ID = ?', [id]);
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;