import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Table, Button, Form, InputGroup, Spinner, Alert, Card } from 'react-bootstrap';
import { FaPlus, FaEdit } from 'react-icons/fa';
import AddEditOrderModal from './AddEditOrderModal';

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchOrderID, setSearchOrderID] = useState('');
  const [searchSupplier, setSearchSupplier] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const editPopupRef = useRef(null);

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
    fetchProducts();
    // Close edit popup on outside click
    const handleClickOutside = (event) => {
      if (editPopupRef.current && !editPopupRef.current.contains(event.target)) {
        setEditIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/purchaseorder');
      setOrders(res.data); // Even if res.data is [], that's not an error!
    } catch (err) {
      setError('Failed to fetch orders.');
    }
    setLoading(false);
  };

  const fetchSuppliers = async () => {
    const res = await axios.get('http://localhost:5000/api/suppliers');
    setSuppliers(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  // Filtered orders
  const filteredOrders = orders.filter(order =>
    order.purchase_OrderID.toString().toLowerCase().includes(searchOrderID.toLowerCase()) &&
    (searchSupplier === '' || (order.supplier_Company && order.supplier_Company === searchSupplier))
  );

  // --- CRUD Handlers ---

  const handleSave = async (order) => {
    setLoading(true);
    setError('');
    try {
      if (editOrder) {
        await axios.put(`http://localhost:5000/api/purchaseorder/${editOrder.purchase_OrderID}`, order);
      } else {
        await axios.post('http://localhost:5000/api/purchaseorder', order);
      }
      fetchOrders();
      setShowModal(false);
      setEditOrder(null);
      setEditIndex(null);
    } catch {
      setError('Failed to save order.');
      setLoading(false);
    }
  };

  const handleEdit = (order, idx) => {
    setEditOrder(order);
    setEditIndex(idx);
    setShowModal(false);
    setError('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setLoading(true);
      setError('');
      try {
        await axios.delete(`http://localhost:5000/api/purchaseorder/${id}`);
        fetchOrders();
        setEditOrder(null);
        setEditIndex(null);
      } catch {
        setError('Failed to delete order.');
        setLoading(false);
      }
    }
  };

  // Show Add
  const handleShowAdd = () => {
    setEditOrder(null);
    setShowModal(true);
    setEditIndex(null);
    setError('');
  };

  return (
    <Card className="shadow-sm border-0 rounded-4 mb-4" style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">Purchase Orders</h5>
        <Button variant="primary" size="sm" onClick={handleShowAdd}>Add Order</Button>
      </Card.Header>
      <Card.Body>
        {/* Search Bar */}
        <div className="d-flex mb-3 gap-3">
          <InputGroup>
            <Form.Control
              placeholder="Order ID"
              value={searchOrderID}
              onChange={e => setSearchOrderID(e.target.value)}
              style={{ minWidth: 220 }}
            />
          </InputGroup>
          <InputGroup>
            <Form.Select
              value={searchSupplier}
              onChange={e => setSearchSupplier(e.target.value)}
              style={{ minWidth: 180 }}
            >
              <option value="">Supplier</option>
              {suppliers.map(sup => (
                <option key={sup.supplier_ID} value={sup.supplier_Company}>{sup.supplier_Company}</option>
              ))}
            </Form.Select>
          </InputGroup>
        </div>

        {/* Purchase Order Table */}
        <div style={{ background: '#f8f9f9', borderRadius: 12, padding: 0, boxShadow: '0 2px 8px #0001' }}>
          <div className="d-flex align-items-center justify-content-between px-4 py-2" style={{ borderBottom: '1px solid #eee' }}>
            <span className="fw-bold" style={{ fontSize: 22 }}>Purchase Order</span>
            <Button variant="light" onClick={handleShowAdd} style={{ borderRadius: '50%', fontSize: 22, width: 38, height: 38 }}>
              <FaPlus />
            </Button>
          </div>
          <Table hover responsive className="mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Supplier</th>
                <th>Contact</th>
                <th>Date</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted">No orders found.</td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={order.purchase_OrderID}>
                    <td>{order.purchase_OrderID}</td>
                    <td>{order.supplier_Company}</td>
                    <td>{order.contact_Person}</td>
                    <td>{order.order_Date}</td>
                    <td>{order.quantity_Ordered}</td>
                    <td>{order.unit_Price}</td>
                    <td>{order.status}</td>
                    <td style={{ position: 'relative' }}>
                      <Button
                        variant="outline-success"
                        size="sm"
                        style={{ borderRadius: '50%' }}
                        onClick={() => handleEdit(order, idx)}
                      >
                        <FaEdit />
                      </Button>
                      {/* Edit/Delete Popup */}
                      {editIndex === idx && (
                        <div
                          ref={editPopupRef}
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 40,
                            background: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: 8,
                            boxShadow: '0 2px 8px #0002',
                            zIndex: 10,
                            padding: 12,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8
                          }}
                        >
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => setShowModal(true)}
                            style={{ minWidth: 70 }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(order.purchase_OrderID)}
                            style={{ minWidth: 70 }}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* Add/Edit Order Modal */}
        {showModal && (
          <AddEditOrderModal
            show={showModal}
            handleClose={() => { setShowModal(false); setEditOrder(null); }}
            handleSave={handleSave}
            initial={editOrder}
            suppliers={suppliers}
            products={products}
          />
        )}
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </Card.Body>
    </Card>
  );
};

export default PurchaseOrders;