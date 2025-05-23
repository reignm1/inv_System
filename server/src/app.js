require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const categoryRoutes = require('./routes/category');
const supplierRoutes = require('./routes/suppliers');
const productRoutes = require('./routes/products');
const stockRoutes = require('./routes/stock');
const purchaseOrderRoutes = require('./routes/purchaseOrders');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

app.use('/api/category', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/purchase_orders', purchaseOrderRoutes);
app.use('/api/users', userRoutes);
app.use('/api', authRoutes);

const pool = require('./db');
pool.getConnection()
  .then(() => {
    console.log('Database Connected - Server is running on port 5000');
    app.listen(5000);
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });