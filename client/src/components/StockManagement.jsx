import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Table, Button, Form, InputGroup, Spinner, Alert, Card } from 'react-bootstrap';
import { FaPlus, FaEdit } from 'react-icons/fa';
import AddEditStockModal from './AddEditStockModal';

const StockManagement = () => {
  const [stock, setStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editStock, setEditStock] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const editPopupRef = useRef(null);

  useEffect(() => {
    fetchStock();
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
    // Close edit popup on outside click
    const handleClickOutside = (event) => {
      if (editPopupRef.current && !editPopupRef.current.contains(event.target)) {
        setEditIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch {}
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/category');
      setCategories(res.data);
    } catch {}
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(res.data);
    } catch {}
  };

  // Get product/category/supplier info for each stock row
  const getProductInfo = (product_ID) => {
    const prod = products.find(p => p.product_ID === product_ID) || {};
    const cat = categories.find(c => c.category_ID === prod.category_ID) || {};
    const sup = suppliers.find(s => s.supplier_ID === prod.supplier_ID) || {};
    return {
      product_Name: prod.product_Name || '',
      category_Name: cat.category_Name || '',
      supplier_Name: sup.contact_Person || sup.supplier_Company || ''
    };
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
      setEditIndex(null);
    } catch (err) {
      setError('Failed to save stock.');
      setLoading(false);
    }
  };

  const handleEdit = (item, idx) => {
    setEditStock(item);
    setEditIndex(idx);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stock item?')) {
      setLoading(true);
      setError('');
      try {
        await axios.delete(`http://localhost:5000/api/stock/${id}`);
        fetchStock();
        setEditStock(null);
        setEditIndex(null);
      } catch (err) {
        setError('Failed to delete stock.');
        setLoading(false);
      }
    }
  };

  const handleShowAdd = () => {
    setEditStock(null);
    setShowModal(true);
    setEditIndex(null);
  };

  // Filtered stock by product name/category
  const filteredStock = stock.filter(item => {
    const info = getProductInfo(item.product_ID);
    return (
      info.product_Name.toLowerCase().includes(search.toLowerCase()) ||
      info.category_Name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Card className="shadow-sm border-0 rounded-4 mb-4">
      <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">Stock Management</h5>
        <Button variant="primary" size="sm" onClick={() => { setEditStock(null); setShowModal(true); }}>Add Stock</Button>
      </Card.Header>
      <Card.Body>
        {/* Search Bar */}
        <div className="d-flex mb-3 gap-3">
          <InputGroup>
            <Form.Control
              placeholder="Stock Category"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ minWidth: 220 }}
            />
          </InputGroup>
          <Button variant="light" style={{ minWidth: 180, fontSize: 22, border: '1px solid #bbb' }}>Category</Button>
        </div>

        {/* Stock Table */}
        <div style={{ background: '#f8f9f9', borderRadius: 12, padding: 0, boxShadow: '0 2px 8px #0001' }}>
          <div className="d-flex align-items-center justify-content-between px-4 py-2" style={{ borderBottom: '1px solid #eee' }}>
            <span className="fw-bold" style={{ fontSize: 22 }}>Stock</span>
            <Button variant="light" onClick={handleShowAdd} style={{ borderRadius: '50%', fontSize: 22, width: 38, height: 38 }}>
              <FaPlus />
            </Button>
          </div>
          {error && <Alert variant="danger" className="m-3">{error}</Alert>}
          {loading ? (
            <div className="text-center my-4"><Spinner animation="border" /></div>
          ) : (
            <Table hover responsive className="mb-0" style={{ background: 'transparent' }}>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Supplier</th>
                  <th>Stock Quantity</th>
                  <th style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredStock.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">No stock data found.</td>
                  </tr>
                ) : (
                  filteredStock.map((item, idx) => {
                    const info = getProductInfo(item.product_ID);
                    return (
                      <tr key={item.stock_ID}>
                        <td>{info.product_Name}</td>
                        <td>{info.category_Name}</td>
                        <td>{info.supplier_Name}</td>
                        <td>{item.stock_Quantity}</td>
                        <td style={{ position: 'relative' }}>
                          <Button
                            variant="outline-success"
                            size="sm"
                            style={{ borderRadius: '50%' }}
                            onClick={() => handleEdit(item, idx)}
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
                                onClick={() => { setShowModal(true); setEditIndex(null); }}
                                style={{ minWidth: 70 }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(item.stock_ID)}
                                style={{ minWidth: 70 }}
                              >
                                Delete
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          )}
        </div>
      </Card.Body>
      {/* Add/Edit Stock Modal */}
      {showModal && (
        <AddEditStockModal
          show={showModal}
          handleClose={() => { setShowModal(false); setEditStock(null); }}
          handleSave={handleSave}
          initial={editStock}
          products={products}
        />
      )}
    </Card>
  );
};

export default StockManagement;