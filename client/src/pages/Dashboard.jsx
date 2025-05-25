import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, Users, ShoppingCart, AlertTriangle } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState({});
  const [products, setProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [stockLevels, setStockLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = 'http://localhost:5000/api';
  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const summary = await (await fetch(`${API_BASE}/dashboard/summary`)).json();
      const products = await (await fetch(`${API_BASE}/dashboard/products`)).json();
      const categories = await (await fetch(`${API_BASE}/dashboard/category-distribution`)).json();
      const stock = await (await fetch(`${API_BASE}/dashboard/stock-levels`)).json();

      setSummaryData(summary);
      setProducts(products);
      setCategoryData(categories);
      setStockLevels(stock);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-3 px-4 bg-light vh-100 overflow-hidden">
      <div className="mb-3">
        <h2 className="fw-bold mb-1">Dashboard</h2>
        <p className="text-muted">Welcome back, Admin</p>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-3">
        <SummaryCard icon={<Package />} label="Total Products" value={summaryData.totalProducts} color="success" />
        <SummaryCard icon={<Users />} label="Total Suppliers" value={summaryData.totalSuppliers} color="primary" />
        <SummaryCard icon={<ShoppingCart />} label="Pending Orders" value={summaryData.pendingOrders} color="warning" />
        <SummaryCard icon={<AlertTriangle />} label="Stock Alerts" value={summaryData.stockAlerts} color="danger" />
      </div>

      {/* Main Dashboard Grid */}
      <div className="d-flex gap-3" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Product Table */}
        <div className="card flex-fill shadow-sm" style={{ width: '30%', maxHeight: '70%', marginTop: '20px'}}>
          <div className="card-header bg-white border-0 d-flex justify-content-between">
            <h6 className="mb-0">Recent Products</h6>
            <button className="btn btn-sm btn-outline-secondary" onClick={fetchDashboardData}>↻</button>
          </div>
          <div className="card-body p-0 overflow-auto" style={{ maxHeight: '100%' }}>
            <table className="table table-sm mb-0">
              <thead className="table-light">
                <tr>
                  <th>Category</th>
                  <th>Product</th>
                  <th>ID</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map(p => (
                  <tr key={p.product_ID}>
                    <td>{p.category_Name || 'Uncategorized'}</td>
                    <td>{p.product_Name}</td>
                    <td>{p.product_ID}</td>
                    <td>
                      <span className={`badge bg-${p.stock_Quantity < 10 ? 'danger' : 'success'}`}>
                        {p.stock_Quantity}
                      </span>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan="4" className="text-center text-muted py-2">No data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card shadow-sm" style={{ width: '30%', maxHeight: '70%', marginTop: '20px'}}>
          <div className="card-header bg-white border-0">
            <h6 className="mb-0">Stock by Category</h6>
          </div>
          <div className="card-body p-0">
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={stockLevels}>
                <XAxis dataKey="category_Name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_stock" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card shadow-sm" style={{ width: '30%', maxHeight: '70%', marginTop: '20px'}}>
          <div className="card-header bg-white border-0">
            <h6 className="mb-0">Category Distribution</h6>
          </div>
          <div className="card-body p-0">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="product_count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="d-flex flex-wrap justify-content-center small py-2">
              {categoryData.map((entry, index) => (
                <div key={index} className="d-flex align-items-center mx-2">
                  <div className="me-2 rounded-circle" style={{
                    backgroundColor: COLORS[index % COLORS.length],
                    width: '10px', height: '10px'
                  }}></div>
                  <span>{entry.category_Name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SummaryCard Component
const SummaryCard = ({ icon, label, value = 0, color }) => (
  <div className="col-6 col-lg-3">
    <div className={`card shadow-sm border-start border-${color} border-4`}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <small className="text-muted">{label}</small>
          <h5 className="fw-bold mb-0">{value}</h5>
        </div>
        <div className={`text-${color}`}>{icon}</div>
      </div>
    </div>
  </div>
);

export default Dashboard;
