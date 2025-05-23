import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Table, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit } from 'react-icons/fa';
import AddEditProductModal from './AddEditProductModal';

const initialFormState = {
  product_Name: '',
  category_ID: '',
  supplier_ID: '',
  price: '',
  product_Quantity: ''
};

const Product = ({ category = [], suppliers = [] }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [editIndex, setEditIndex] = useState(null); // index of row being edited
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // For closing edit popup when clicking outside
  const editPopupRef = useRef(null);

  useEffect(() => {
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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch {
      setError('Failed to fetch products.');
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const res = await axios.get('http://localhost:5000/api/category');
    setCategories(res.data);
  };

  const fetchSuppliers = async () => {
    const res = await axios.get('http://localhost:5000/api/suppliers');
    setSuppliersList(res.data);
  };

  // Filtered products
  const filteredProducts = products.filter(prod =>
    prod.product_Name.toLowerCase().includes(searchName.toLowerCase()) &&
    (searchCategory === '' || prod.category_Name === searchCategory)
  );

  // --- CRUD Handlers ---

  // Add or Edit
  const handleSave = async () => {
    setError('');
    if (!form.product_Name.trim()) return setError('Item Name is required.');
    if (!form.category_ID) return setError('Category is required.');
    if (!form.supplier_ID) return setError('Supplier is required.');
    if (form.price && Number(form.price) < 0) return setError('Price must be positive.');
    if (form.product_Quantity && Number(form.product_Quantity) < 0) return setError('Quantity must be positive.');

    setLoading(true);
    try {
      if (form.product_ID) {
        // Edit
        await axios.put(`http://localhost:5000/api/products/${form.product_ID}`, form);
      } else {
        // Add
        await axios.post('http://localhost:5000/api/products', form);
      }
      fetchProducts();
      handleClear();
      setShowAdd(false);
      setEditIndex(null);
    } catch {
      setError('Failed to save product.');
    }
    setLoading(false);
  };

  // Delete
  const handleDelete = async (id = form.product_ID) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
      handleClear();
      setShowAdd(false);
      setEditIndex(null);
    } catch {
      setError('Failed to delete product.');
    }
    setLoading(false);
  };

  // Edit
  const handleEdit = (prod, idx) => {
    setForm({
      product_ID: prod.product_ID,
      product_Name: prod.product_Name,
      category_ID: prod.category_ID,
      supplier_ID: prod.supplier_ID,
      price: prod.price,
      product_Quantity: prod.product_Quantity
    });
    setShowAdd(true);
    setEditIndex(null);
    setError('');
  };

  // Show Add
  const handleShowAdd = () => {
    setForm(initialFormState);
    setShowAdd(true);
    setEditIndex(null);
    setError('');
  };

  // Clear form
  const handleClear = () => {
    setForm(initialFormState);
    setError('');
  };

  // --- Render ---

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      {/* Search Bar */}
      <div className="d-flex mb-3 gap-3">
        <InputGroup>
          <Form.Control
            placeholder="Product Name"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            style={{ minWidth: 220 }}
          />
        </InputGroup>
        <InputGroup>
          <Form.Select
            value={searchCategory}
            onChange={e => setSearchCategory(e.target.value)}
            style={{ minWidth: 180 }}
          >
            <option value="">Category</option>
            {categories.map(cat => (
              <option key={cat.category_ID} value={cat.category_Name}>{cat.category_Name}</option>
            ))}
          </Form.Select>
        </InputGroup>
      </div>

      {/* Inventory Table */}
      <div style={{ background: '#f8f9f9', borderRadius: 12, padding: 0, boxShadow: '0 2px 8px #0001' }}>
        <div className="d-flex align-items-center justify-content-between px-4 py-2" style={{ borderBottom: '1px solid #eee' }}>
          <span className="fw-bold" style={{ fontSize: 22 }}>Inventory</span>
          <Button variant="light" onClick={handleShowAdd} style={{ borderRadius: '50%', fontSize: 22, width: 38, height: 38 }}>
            <FaPlus />
          </Button>
        </div>
        <Table hover responsive className="mb-0" style={{ background: 'transparent' }}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Supplier</th>
              <th>Product Quantity</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">No products found.</td>
              </tr>
            ) : (
              filteredProducts.map((prod, idx) => (
                <tr key={prod.product_ID}>
                  <td>{prod.product_Name}</td>
                  <td>{prod.category_Name}</td>
                  <td>{prod.price}</td>
                  <td>{prod.supplier_Company}</td>
                  <td>{prod.product_Quantity}</td>
                  <td style={{ position: 'relative' }}>
                    <Button
                      variant="outline-success"
                      size="sm"
                      style={{ borderRadius: '50%' }}
                      onClick={() => handleEdit(prod, idx)}
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
                          onClick={() => setShowAdd(true)}
                          style={{ minWidth: 70 }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(prod.product_ID)}
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

      {/* Add/Edit Product Form */}
      {showAdd && (
        <AddEditProductModal
          show={showAdd}
          handleClose={() => { setShowAdd(false); handleClear(); }}
          handleSave={async (product) => {
            setError('');
            setLoading(true);
            try {
              if (product.product_ID) {
                await axios.put(`http://localhost:5000/api/products/${product.product_ID}`, product);
              } else {
                await axios.post('http://localhost:5000/api/products', product);
              }
              fetchProducts();
              setShowAdd(false);
              setEditIndex(null);
            } catch {
              setError('Failed to save product.');
            }
            setLoading(false);
          }}
          initial={form.product_ID ? form : null}
          categories={categories}
          suppliers={suppliersList}
        />
      )}
    </div>
  );
};

export default Product;