import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, Button, InputGroup, Form, Alert } from 'react-bootstrap';
import { FaEdit, FaPlus, FaSearch } from 'react-icons/fa';
import AddEditStockModal from './AddEditStockModal';

const StockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editStock, setEditStock] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const popupRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) fetchStocks();
  }, [products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setEditIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(res.data);
    } catch (err) {
      setError('Failed to fetch products: ' + err.message);
    }
  };

  const fetchStocks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/stock', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const stocksWithNames = res.data.map(stock => {
        const prod = products.find(p => p.product_ID === stock.product_ID);
        return {
          ...stock,
          product_Name: prod ? prod.product_Name : 'Unknown Product',
        };
      });
      setStocks(stocksWithNames);
    } catch (err) {
      setError('Failed to fetch stock.');
    }
    setLoading(false);
  };

  const handleSave = async (stock) => {
    setLoading(true);
    setError('');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      if (editStock) {
        await axios.put(`http://localhost:5000/api/stock/${editStock.stock_ID}`, stock, config);
      } else {
        await axios.post('http://localhost:5000/api/stock', stock, config);
      }
      await fetchStocks();
      setShowModal(false);
      setEditStock(null);
      setEditIndex(null);
    } catch (err) {
      setError('Failed to save stock.');
    }
    setLoading(false);
  };

  const handleEditClick = (idx) => {
    setEditIndex(editIndex === idx ? null : idx);
  };

  const handleEdit = (stock) => {
    setEditStock(stock);
    setShowModal(true);
    setEditIndex(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stock entry?')) {
      setLoading(true);
      setError('');
      try {
        await axios.delete(`http://localhost:5000/api/stock/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        await fetchStocks();
        setEditStock(null);
        setEditIndex(null);
      } catch (err) {
        setError('Failed to delete stock.');
      }
      setLoading(false);
    }
  };

  const filteredStocks = stocks.filter(stock =>
    stock.product_Name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ocntainer my-4">
      <div className="d-flex flex-wrap gap-2 mb-3">
        <InputGroup>
          <Form.Control
            placeholder="Search Product Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
          />
          <FaSearch style={{ position: 'absolute', left: 270, top: 10 }} />
        </InputGroup>
      </div>
      <div className="card shadow-sm">
        <div className="d-flex align-items-center justify-content-between px-4 py-2" style={{ borderBottom: '1px solid #eee' }}>
          <span className="fw-bold" style={{ fontSize: 21 }}>Stock</span>
          <Button
            variant="success"
            style={{ maxHeight: 30, position: 'absolute', right: 15 }}
            onClick={() => { setShowModal(true); setEditStock(null); }}
          >
            <FaPlus style={{ marginBottom: 9 }} />
          </Button>
        </div>
        {error && <Alert variant="danger" className="m-3">{error}</Alert>}
        {loading ? (
          <div className="text-center my-4">Loading...</div>
        ) : (
          <Table hover className="mb-0 table-striped">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Last Restock Date</th>
                <th style={{ width: 80 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted">No stock entries found.</td>
                </tr>
              ) : (
                filteredStocks.map((stock, idx) => (
                  <tr key={stock.stock_ID}>
                    <td>{stock.product_Name}</td>
                    <td>{stock.stock_Quantity}</td>
                    <td>{stock.last_RestockDate ? new Date(stock.last_RestockDate).toLocaleDateString() : ''}</td>
                    <td style={{ position: 'relative' }}>
                      <Button
                        variant="outline-success"
                        size="sm"
                        style={{ borderRadius: '50%' }}
                        onClick={() => handleEditClick(idx)}
                      >
                        <FaEdit />
                      </Button>
                      {editIndex === idx && (
                        <div
                          ref={popupRef}
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
                            onClick={() => handleEdit(stock)}
                            style={{ minWidth: 70 }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(stock.stock_ID)}
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
        )}
      </div>
      {showModal && (
        <AddEditStockModal
          show={showModal}
          handleClose={() => { setShowModal(false); setEditStock(null); }}
          handleSave={handleSave}
          initial={editStock}
          products={products}
        />
      )}
    </div>
  );
};

export default StockManagement;
