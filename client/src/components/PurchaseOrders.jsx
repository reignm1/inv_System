import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Table, Button, Form, InputGroup, Alert, Card } from 'react-bootstrap';
import { FaPlus, FaEdit } from 'react-icons/fa';
import AddEditOrderModal from './AddEditOrderModal';

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
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
      console.log('Fetched orders:', res.data); // Debug log to check data structure
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders.');
    }
    setLoading(false);
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/suppliers');
      console.log('Fetched suppliers:', res.data); // Debug log
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const orderIdMatch = order.purchase_OrderID.toString().toLowerCase().includes(searchOrderID.toLowerCase());
    const supplierMatch = searchSupplier === '' || 
      (order.supplier_Company && order.supplier_Company.toLowerCase().includes(searchSupplier.toLowerCase()));
    
    return orderIdMatch && supplierMatch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '';
    return parseFloat(price).toFixed(2);
  };

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
    } catch (err) {
      console.error('Error saving order:', err);
      setError('Failed to save order.');
      setLoading(false);
    }
  };

  const handleEdit = (order) => {
    setEditOrder(order);
    setShowModal(true);
    setEditIndex(null);
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
      } catch (err) {
        console.error('Error deleting order:', err);
        setError('Failed to delete order.');
        setLoading(false);
      }
    }
  };

  const handleShowAdd = () => {
    setEditOrder(null);
    setShowModal(true);
    setEditIndex(null);
    setError('');
  };

  if (loading && orders.length === 0) {
    return (
      <Card className="shadow-sm border-0 rounded-4 mb-4" style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
        <Card.Body className="text-center">
          <p className="mt-2">Loading purchase orders...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="container my-4">
        {/* Search Bar */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          <InputGroup style={{ maxWidth: 250 }}>
            <Form.Control
              placeholder="Search Order ID"
              value={searchOrderID}
              onChange={(e) => setSearchOrderID(e.target.value)}
            />
          </InputGroup>
          <InputGroup style={{ maxWidth: 250 }}>
            <Form.Control
              placeholder="Search Supplier"
              value={searchSupplier}
              onChange={(e) => setSearchSupplier(e.target.value)}
            />
          </InputGroup>
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={() => {
              setSearchOrderID('');
              setSearchSupplier('');
            }}
          >
            Clear Filters
          </Button>
        </div>

        {/* Table */}
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span className="fw-bold" style={{ fontSize: 22 }}>Purchase Orders</span>
            <Button 
              variant="success" 
              onClick={handleShowAdd} 
              className="d-flex align-items-center justify-content-center"
            >
              <FaPlus />
            </Button>
          </div>
          
          <div>
            <Table hover className="mb-0 table-striped" style={{ background: 'transparent' }}>
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Supplier</th>
                  <th>Contact</th>
                  <th>Date</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th style={{ width: 80}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      {loading ? 'Loading...' : 'No orders found.'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, idx) => (
                    <tr key={order.purchase_OrderID}>
                      <td className="fw-semibold">{order.purchase_OrderID}</td>
                      <td>{order.supplier_Company || 'N/A'}</td>
                      <td>{order.contact_Person || 'N/A'}</td>
                      <td>{formatDate(order.order_Date)}</td>
                      <td>{order.quantity_Ordered}</td>
                      <td>₱ {formatPrice(order.unit_Price)}</td>
                      <td>
                        <span className={`badge ${
                          order.status === 'Pending' ? 'bg-warning text-dark' : 
                          order.status === 'Completed' ? 'bg-success' : 
                          order.status === 'Cancelled' ? 'bg-danger' :
                          'bg-secondary'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ position: 'relative' }}>
                        <Button
                          variant="outline-success"
                          size="sm"
                          style={{borderRadius: '50%'}}
                          onClick={() => setEditIndex(editIndex === idx ? null : idx)}
                        >
                          <FaEdit/>
                        </Button>
                        {editIndex === idx && (
                          <div
                            ref={editPopupRef}
                            style={{
                              position: 'absolute',
                              top: 0,
                              right: 45,
                              background: '#fff',
                              border: '1px solid #dee2e6',
                              borderRadius: 8,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              zIndex: 1000,
                              padding: 8,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 4,
                              minWidth: 100
                            }}
                          >
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={() => handleEdit(order)}
                              className="text-start"
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={() => handleDelete(order.purchase_OrderID)}
                              className="text-start"
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
        </div>

        {/* Error Alert */}
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        {/* Modal */}
        {showModal && (
          <AddEditOrderModal
            show={showModal}
            handleClose={() => { 
              setShowModal(false); 
              setEditOrder(null); 
            }}
            handleSave={handleSave}
            initial={editOrder}
            suppliers={suppliers}
          />
        )}
    </div>
  );
};

export default PurchaseOrders;