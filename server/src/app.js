const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const categoriesRoutes = require('./routes/categories');
const suppliersRoutes = require('./routes/suppliers');
const productsRoutes = require('./routes/products');
const stockRoutes = require('./routes/stock');
const purchaseOrdersRoutes = require('./routes/purchaseOrders');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const loginRoutes = require('./routes/login');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

// Routes
app.use('/api/categories', categoriesRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/purchase-orders', purchaseOrdersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api', authRoutes);
app.use('/api', loginRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Database Connected - Server is running on port ${PORT}`);
});