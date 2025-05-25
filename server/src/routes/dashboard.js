// routes/dashboard.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get dashboard summary data
router.get('/summary', async (req, res) => {
  try {
    // Get total products
    const [productCount] = await pool.execute('SELECT COUNT(*) as count FROM product');
    
    // Get total suppliers
    const [supplierCount] = await pool.execute('SELECT COUNT(*) as count FROM supplier');
    
    // Get pending orders
    const [pendingOrders] = await pool.execute(
      "SELECT COUNT(*) as count FROM purchaseorder WHERE status = 'Pending'"
    );
    
    // Get stock alerts (items with quantity < 10)
    const [stockAlerts] = await pool.execute(
      'SELECT COUNT(*) as count FROM stock WHERE stock_Quantity < 10'
    );

    res.json({
      totalProducts: productCount[0].count,
      totalSuppliers: supplierCount[0].count,
      pendingOrders: pendingOrders[0].count,
      stockAlerts: stockAlerts[0].count
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get products with stock info for the dashboard table
router.get('/products', async (req, res) => {
  try {
    const [products] = await pool.execute(`
      SELECT 
        p.product_ID,
        p.product_Name,
        c.category_Name,
        COALESCE(s.stock_Quantity, 0) as stock_Quantity
      FROM product p
      LEFT JOIN category c ON p.category_ID = c.category_ID
      LEFT JOIN stock s ON p.product_ID = s.product_ID
      ORDER BY p.product_Name
      LIMIT 10
    `);

    res.json(products);
  } catch (error) {
    console.error('Dashboard products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get category distribution for pie chart
router.get('/category-distribution', async (req, res) => {
  try {
    const [categories] = await pool.execute(`
      SELECT 
        c.category_Name,
        COUNT(p.product_ID) as product_count,
        ROUND((COUNT(p.product_ID) * 100.0 / (SELECT COUNT(*) FROM product)), 1) as percentage
      FROM category c
      LEFT JOIN product p ON c.category_ID = p.category_ID
      GROUP BY c.category_ID, c.category_Name
      HAVING product_count > 0
      ORDER BY product_count DESC
    `);

    res.json(categories);
  } catch (error) {
    console.error('Category distribution error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get stock levels by category for bar chart
router.get('/stock-levels', async (req, res) => {
  try {
    const [stockLevels] = await pool.execute(`
      SELECT 
        c.category_Name,
        SUM(COALESCE(s.stock_Quantity, 0)) as total_stock
      FROM category c
      LEFT JOIN product p ON c.category_ID = p.category_ID
      LEFT JOIN stock s ON p.product_ID = s.product_ID
      GROUP BY c.category_ID, c.category_Name
      ORDER BY total_stock DESC
      LIMIT 5
    `);

    res.json(stockLevels);
  } catch (error) {
    console.error('Stock levels error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recent purchase orders
router.get('/recent-orders', async (req, res) => {
  try {
    const [orders] = await pool.execute(`
      SELECT 
        po.purchase_OrderID,
        s.supplier_Company,
        po.order_Date,
        po.quantity_Ordered,
        po.unit_Price,
        po.status,
        (po.quantity_Ordered * po.unit_Price) as total_amount
      FROM purchaseorder po
      LEFT JOIN supplier s ON po.supplier_ID = s.supplier_ID
      ORDER BY po.order_Date DESC
      LIMIT 5
    `);

    res.json(orders);
  } catch (error) {
    console.error('Recent orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get low stock items
router.get('/low-stock', async (req, res) => {
  try {
    const [lowStock] = await pool.execute(`
      SELECT 
        p.product_Name,
        c.category_Name,
        s.stock_Quantity,
        p.product_ID
      FROM product p
      LEFT JOIN category c ON p.category_ID = c.category_ID
      LEFT JOIN stock s ON p.product_ID = s.product_ID
      WHERE s.stock_Quantity < 10 OR s.stock_Quantity IS NULL
      ORDER BY COALESCE(s.stock_Quantity, 0) ASC
      LIMIT 10
    `);

    res.json(lowStock);
  } catch (error) {
    console.error('Low stock error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;