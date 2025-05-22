const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Add a category
router.post('/', async (req, res) => {
  const { category_Name } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO categories (category_Name) VALUES (?)', [category_Name]);
    res.json({ category_ID: result.insertId, category_Name });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { category_Name } = req.body;
  try {
    await pool.query('UPDATE categories SET category_Name = ? WHERE category_ID = ?', [category_Name, id]);
    res.json({ category_ID: id, category_Name });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM categories WHERE category_ID = ?', [id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;