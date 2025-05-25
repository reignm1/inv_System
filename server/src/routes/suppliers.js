const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        supplier_ID,
        supplier_Company,
        contact_Person,
        supplier_ContactNumber,
        supplier_Email,
        supplier_Address
      FROM supplier
      ORDER BY supplier_Company ASC
    `);
    
    console.log('Suppliers fetched:', rows.length); // Debug log
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Get single supplier by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT 
        supplier_ID,
        supplier_Company,
        contact_Person,
        supplier_ContactNumber,
        supplier_Email,
        supplier_Address
      FROM supplier
      WHERE supplier_ID = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Add a supplier
router.post('/', async (req, res) => {
  const { supplier_Company, contact_Person, supplier_ContactNumber, supplier_Email, supplier_Address } = req.body;
  
  // Validation
  if (!supplier_Company) {
    return res.status(400).json({ message: 'Supplier company name is required' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO supplier (supplier_Company, contact_Person, supplier_ContactNumber, supplier_Email, supplier_Address) VALUES (?, ?, ?, ?, ?)',
      [supplier_Company, contact_Person, supplier_ContactNumber, supplier_Email, supplier_Address]
    );
    
    // Fetch the created supplier
    const [createdSupplier] = await pool.query(
      'SELECT * FROM supplier WHERE supplier_ID = ?',
      [result.insertId]
    );
    
    res.status(201).json(createdSupplier[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Update a supplier
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { supplier_Company, contact_Person, supplier_ContactNumber, supplier_Email, supplier_Address } = req.body;
  
  // Validation
  if (!supplier_Company) {
    return res.status(400).json({ message: 'Supplier company name is required' });
  }
  
  try {
    // Check if supplier exists
    const [existing] = await pool.query('SELECT * FROM supplier WHERE supplier_ID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    // Update the supplier
    await pool.query(
      'UPDATE supplier SET supplier_Company = ?, contact_Person = ?, supplier_ContactNumber = ?, supplier_Email = ?, supplier_Address = ? WHERE supplier_ID = ?',
      [supplier_Company, contact_Person, supplier_ContactNumber, supplier_Email, supplier_Address, id]
    );
    
    // Fetch the updated supplier
    const [updatedSupplier] = await pool.query(
      'SELECT * FROM supplier WHERE supplier_ID = ?',
      [id]
    );
    
    res.json(updatedSupplier[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Delete a supplier
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Check if supplier exists
    const [existing] = await pool.query('SELECT * FROM supplier WHERE supplier_ID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    // Check if supplier has associated purchase orders
    const [orders] = await pool.query('SELECT COUNT(*) as count FROM purchaseorder WHERE supplier_ID = ?', [id]);
    if (orders[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete supplier. There are existing purchase orders associated with this supplier.' 
      });
    }
    
    // Check if supplier has associated products
    const [products] = await pool.query('SELECT COUNT(*) as count FROM product WHERE supplier_ID = ?', [id]);
    if (products[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete supplier. There are existing products associated with this supplier.' 
      });
    }
    
    await pool.query('DELETE FROM supplier WHERE supplier_ID = ?', [id]);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Search suppliers
router.get('/search/:term', async (req, res) => {
  const { term } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT 
        supplier_ID,
        supplier_Company,
        contact_Person,
        supplier_ContactNumber,
        supplier_Email,
        supplier_Address
      FROM supplier
      WHERE supplier_Company LIKE ? OR contact_Person LIKE ? OR supplier_Email LIKE ?
      ORDER BY supplier_Company ASC
    `, [`%${term}%`, `%${term}%`, `%${term}%`]);
    
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;