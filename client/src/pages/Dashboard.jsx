import React from 'react';
import Sidebar from '../components/Sidebar';
// For charts, install recharts: npm install recharts
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const pieData = [
  { name: 'Household Essentials', value: 11.3 },
  { name: 'Food & Beverages', value: 34 },
  { name: 'Appliances', value: 22.6 },
  { name: 'Furniture', value: 15.1 },
  { name: 'Kitchen Goods', value: 17 }
];
const pieColors = ['#f7b267', '#f4845f', '#45b8ac', '#f76c6c', '#f7d08a'];

const barData = [
  { name: 'Frozen Goods', value: 2 },
  { name: 'School Supplies', value: 4 },
  { name: 'Personal Care', value: 7 },
  { name: 'Fresh Produce', value: 7 }
];

const Dashboard = () => (
  <div className="d-flex" style={{ minHeight: '100vh' }}>
    <Sidebar />
    <div className="flex-grow-1 p-4" style={{ background: '#fff' }}>
      <h2 className="fw-bold mb-2" style={{ fontFamily: 'Poppins, Arial, sans-serif' }}>Welcome back, Admin</h2>
      <hr />
      <div className="mb-4">
        <span className="fs-4 fw-semibold">Dashboard</span>
      </div>
      <div className="row mb-4">
        <div className="col">
          <div className="border rounded-3 p-3 text-center">
            <div className="fw-semibold">Total Products</div>
            <div className="fs-3">19</div>
          </div>
        </div>
        <div className="col">
          <div className="border rounded-3 p-3 text-center">
            <div className="fw-semibold">Total Suppliers</div>
            <div className="fs-3">19</div>
          </div>
        </div>
        <div className="col">
          <div className="border rounded-3 p-3 text-center">
            <div className="fw-semibold">Pending Orders</div>
            <div className="fs-3">19</div>
          </div>
        </div>
        <div className="col">
          <div className="border rounded-3 p-3 text-center">
            <div className="fw-semibold">Stock Alert</div>
            <div className="fs-3">19</div>
          </div>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-md-8">
          <div className="border rounded-3 p-3 mb-4">
            <table className="table table-bordered mb-0">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Product</th>
                  <th>ID</th>
                  <th>In Stock</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Household Essentials</td>
                  <td>Detergent</td>
                  <td>01231</td>
                  <td>106</td>
                </tr>
                <tr>
                  <td>Food & Beverages</td>
                  <td>Frozen Meat</td>
                  <td>01231</td>
                  <td>106</td>
                </tr>
                <tr>
                  <td>Appliances</td>
                  <td>Microwave</td>
                  <td>01231</td>
                  <td>106</td>
                </tr>
                <tr>
                  <td>Furniture</td>
                  <td>Sofa Bed</td>
                  <td>01231</td>
                  <td>106</td>
                </tr>
                <tr>
                  <td>Kitchen Goods</td>
                  <td>Food Storage</td>
                  <td>01231</td>
                  <td>106</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border rounded-3 p-3">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={entry.name} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-md-4">
          <div className="border rounded-3 p-3">
            <div className="fw-semibold mb-2">Stocks</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Bar dataKey="value" fill="#45b8ac" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;