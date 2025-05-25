const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all purchase orders with supplier details
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        po.purchase_OrderID,
        po.supplier_ID,
        s.supplier_Company,
        s.contact_Person,
        s.supplier_ContactNumber,
        s.supplier_Email,
        po.order_Date,
        po.quantity_Ordered,
        po.unit_Price,
        po.status
      FROM purchaseorder po
      LEFT JOIN supplier s ON po.supplier_ID = s.supplier_ID
      ORDER BY po.purchase_OrderID DESC
    `);
    
    console.log('Purchase orders fetched:', rows.length); // Debug log
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Get single purchase order by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT 
        po.purchase_OrderID,
        po.supplier_ID,
        s.supplier_Company,
        s.contact_Person,
        s.supplier_ContactNumber,
        s.supplier_Email,
        po.order_Date,
        po.quantity_Ordered,
        po.unit_Price,
        po.status
      FROM purchaseOrder po
      LEFT JOIN supplier s ON po.supplier_ID = s.supplier_ID
      WHERE po.purchase_OrderID = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Add a purchase order
router.post('/', async (req, res) => {
  const { supplier_ID, order_Date, quantity_Ordered, unit_Price, status } = req.body;
  
  // Validation
  if (!supplier_ID) {
    return res.status(400).json({ message: 'Supplier ID is required' });
  }
  if (!quantity_Ordered || quantity_Ordered <= 0) {
    return res.status(400).json({ message: 'Valid quantity is required' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO purchaseorder (supplier_ID, order_Date, quantity_Ordered, unit_Price, status) VALUES (?, ?, ?, ?, ?)',
      [
        supplier_ID, 
        order_Date || new Date().toISOString().split('T')[0], // Default to today if not provided
        quantity_Ordered, 
        unit_Price || 0, 
        status || 'Pending'
      ]
    );
    
    // Fetch the created order with supplier details
    const [createdOrder] = await pool.query(`
      SELECT 
        po.purchase_OrderID,
        po.supplier_ID,
        s.supplier_Company,
        s.contact_Person,
        s.supplier_ContactNumber,
        s.supplier_Email,
        po.order_Date,
        po.quantity_Ordered,
        po.unit_Price,
        po.status
      FROM purchaseorder po
      LEFT JOIN supplier s ON po.supplier_ID = s.supplier_ID
      WHERE po.purchase_OrderID = ?
    `, [result.insertId]);
    
    res.status(201).json(createdOrder[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Update a purchase order
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { supplier_ID, order_Date, quantity_Ordered, unit_Price, status } = req.body;
  
  // Validation
  if (!supplier_ID) {
    return res.status(400).json({ message: 'Supplier ID is required' });
  }
  if (!quantity_Ordered || quantity_Ordered <= 0) {
    return res.status(400).json({ message: 'Valid quantity is required' });
  }
  
  try {
    // Check if purchase order exists
    const [existing] = await pool.query('SELECT * FROM purchaseorder WHERE purchase_OrderID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }
    
    // Update the purchase order
    await pool.query(
      'UPDATE purchaseorder SET supplier_ID = ?, order_Date = ?, quantity_Ordered = ?, unit_Price = ?, status = ? WHERE purchase_OrderID = ?',
      [supplier_ID, order_Date, quantity_Ordered, unit_Price || 0, status || 'Pending', id]
    );
    
    // Fetch the updated order with supplier details
    const [updatedOrder] = await pool.query(`
      SELECT 
        po.purchase_OrderID,
        po.supplier_ID,
        s.supplier_Company,
        s.contact_Person,
        s.supplier_ContactNumber,
        s.supplier_Email,
        po.order_Date,
        po.quantity_Ordered,
        po.unit_Price,
        po.status
      FROM purchaseorder po
      LEFT JOIN supplier s ON po.supplier_ID = s.supplier_ID
      WHERE po.purchase_OrderID = ?
    `, [id]);
    
    res.json(updatedOrder[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Delete a purchase order
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Check if purchase order exists
    const [existing] = await pool.query('SELECT * FROM purchaseorder WHERE purchase_OrderID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }
    
    await pool.query('DELETE FROM purchaseorder WHERE purchase_OrderID = ?', [id]);
    res.json({ message: 'Purchase order deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Get purchase orders by supplier
router.get('/supplier/:supplierId', async (req, res) => {
  const { supplierId } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT 
        po.purchase_OrderID,
        po.supplier_ID,
        s.supplier_Company,
        s.contact_Person,
        s.supplier_ContactNumber,
        s.supplier_Email,
        po.order_Date,
        po.quantity_Ordered,
        po.unit_Price,
        po.status
      FROM purchaseorder po
      LEFT JOIN supplier s ON po.supplier_ID = s.supplier_ID
      WHERE po.supplier_ID = ?
      ORDER BY po.purchase_OrderID DESC
    `, [supplierId]);
    
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Get purchase orders by status
router.get('/status/:status', async (req, res) => {
  const { status } = req.params;
  
  // Validate status
  const validStatuses = ['Pending', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be Pending, Completed, or Cancelled' });
  }
  
  try {
    const [rows] = await pool.query(`
      SELECT 
        po.purchase_OrderID,
        po.supplier_ID,
        s.supplier_Company,
        s.contact_Person,
        s.supplier_ContactNumber,
        s.supplier_Email,
        po.order_Date,
        po.quantity_Ordered,
        po.unit_Price,
        po.status
      FROM purchaseorder po
      LEFT JOIN supplier s ON po.supplier_ID = s.supplier_ID
      WHERE po.status = ?
      ORDER BY po.purchase_OrderID DESC
    `, [status]);
    
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;