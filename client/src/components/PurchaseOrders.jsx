import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Alert, Card } from 'react-bootstrap';
import AddEditOrderModal from './AddEditOrderModal';

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/purchaseorders');
      setOrders(res.data);
    } catch (err) {
      setError('Failed to fetch orders.');
    }
    setLoading(false);
  };

  const handleSave = async (order) => {
    setLoading(true);
    setError('');
    try {
      if (editOrder) {
        await axios.put(`http://localhost:5000/api/purchaseorders/${editOrder.purchase_OrderID}`, order);
      } else {
        await axios.post('http://localhost:5000/api/purchaseorders', order);
      }
      fetchOrders();
      setShowModal(false);
      setEditOrder(null);
    } catch (err) {
      setError('Failed to save order.');
      setLoading(false);
    }
  };

  const handleEdit = (order) => {
    setEditOrder(order);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setLoading(true);
      setError('');
      try {
        await axios.delete(`http://localhost:5000/api/purchaseorders/${id}`);
        fetchOrders();
      } catch (err) {
        setError('Failed to delete order.');
        setLoading(false);
      }
    }
  };

  return (
    <Card className="shadow-sm border-0 rounded-4 mb-4">
      <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">Purchase Orders</h5>
        <Button variant="primary" size="sm" onClick={() => { setEditOrder(null); setShowModal(true); }}>Add Order</Button>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="text-center my-4"><Spinner animation="border" /></div>
        ) : (
          <Table hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Supplier</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">No orders found.</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.purchase_OrderID}>
                    <td>{order.purchase_OrderID}</td>
                    <td>{order.supplier_Company}</td>
                    <td>{order.product_Name}</td>
                    <td>{order.quantity_Ordered}</td>
                    <td>{order.order_Date}</td>
                    <td>{order.status}</td>
                    <td>
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleEdit(order)}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(order.purchase_OrderID)}>Delete</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
      <AddEditOrderModal
        show={showModal}
        handleClose={() => { setShowModal(false); setEditOrder(null); }}
        handleSave={handleSave}
        initial={editOrder}
      />
    </Card>
  );
};

export default PurchaseOrders;