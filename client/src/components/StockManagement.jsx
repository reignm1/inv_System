import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Alert, Card } from 'react-bootstrap';
import AddEditStockModal from './AddEditStockModal';

const StockManagement = () => {
  const [stock, setStock] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editStock, setEditStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchStock(); }, []);

  const fetchStock = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/stock');
      setStock(res.data);
    } catch (err) {
      setError('Failed to fetch stock.');
    }
    setLoading(false);
  };

  const handleSave = async (stockItem) => {
    setLoading(true);
    setError('');
    try {
      if (editStock) {
        await axios.put(`http://localhost:5000/api/stock/${editStock.stock_ID}`, stockItem);
      } else {
        await axios.post('http://localhost:5000/api/stock', stockItem);
      }
      fetchStock();
      setShowModal(false);
      setEditStock(null);
    } catch (err) {
      setError('Failed to save stock.');
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditStock(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stock item?')) {
      setLoading(true);
      setError('');
      try {
        await axios.delete(`http://localhost:5000/api/stock/${id}`);
        fetchStock();
      } catch (err) {
        setError('Failed to delete stock.');
        setLoading(false);
      }
    }
  };

  return (
    <Card className="shadow-sm border-0 rounded-4 mb-4">
      <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">Stock Management</h5>
        <Button variant="primary" size="sm" onClick={() => { setEditStock(null); setShowModal(true); }}>Add Stock</Button>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="text-center my-4"><Spinner animation="border" /></div>
        ) : (
          <Table hover responsive>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stock.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted">No stock data found.</td>
                </tr>
              ) : (
                stock.map(item => (
                  <tr key={item.stock_ID}>
                    <td>{item.product_ID}</td>
                    <td>{item.product_Name}</td>
                    <td>{item.stock_Quantity}</td>
                    <td>
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleEdit(item)}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.stock_ID)}>Delete</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
      <AddEditStockModal
        show={showModal}
        handleClose={() => { setShowModal(false); setEditStock(null); }}
        handleSave={handleSave}
        initial={editStock}
      />
    </Card>
  );
};

export default StockManagement;