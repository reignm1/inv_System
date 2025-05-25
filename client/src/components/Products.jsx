import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Table, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit} from 'react-icons/fa';
import AddEditProductModal from './AddEditProductModal';
import AddEditCategoryModal from './AddEditCategoryModal';


const initialFormState = {
  product_Name: '',
  category_ID: '',
  supplier_ID: '',
  price: '',
  product_Quantity: ''
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [editProduct, setEditProduct] = useState(null);
  const [suppliers, setSuppliersList] = useState([]);



  // Category modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);

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

  const fetchProducts = async (search = '') => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/products', getAuthHeaders());
      let data = res.data;
      if (search) {
        data = data.filter(prod =>
          prod.product_Name.toLowerCase().includes(search.toLowerCase())
        );
      }
      setProducts(data);
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

  // --- CRUD Handlers ---

  // Add or Edit
  const handleSave = async (product) => {
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...product,
        category_ID: Number(product.category_ID),
        supplier_ID: Number(product.supplier_ID),
        price: Number(product.price),
        product_Quantity: Number(product.product_Quantity)
      };
      if (product.product_ID) {
        await axios.put(
          `http://localhost:5000/api/products/${product.product_ID}`,
          payload,
          getAuthHeaders()
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/products',
          payload,
          getAuthHeaders()
        );
      }
      await fetchProducts();
      setShowAdd(false);
      setEditIndex(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
    }
    setLoading(false);
  };

  // Delete
const handleDelete = async (id) => {
  if (!id) return;
  if (!window.confirm('Are you sure you want to delete this product?')) return;
  setLoading(true);
  try {
    await axios.delete(`http://localhost:5000/api/products/${id}`, getAuthHeaders());
    await fetchProducts();
    setShowAdd(false);
    setEditIndex(null);
  } catch {
    setError('Failed to delete product.');
  }
  setLoading(false);
};


  // Edit
const handleEdit = (prod) => {
  setEditProduct(prod);  // ✅ sets product to edit
  setShowAdd(true);      // ✅ opens modal
};



  // Show Add
  const handleShowAdd = () => {
    setForm(initialFormState); // Not really needed for add
    setShowAdd(true);
    setEditIndex(null);
    setError('');
  };

  // --- Render ---

  return (
<div className="container my-4">
  {/* Search Bar and Add Category */}
  <div className="d-flex flex-wrap gap-2 mb-3">
    <InputGroup className="flex-grow-1" style={{ maxWidth: 400 }}>
      <Form.Control
        placeholder="Search by Product Name"
        value={searchName}
        onChange={e => setSearchName(e.target.value)}
      />
      <Button style={{ backgroundColor: '#198754', color: 'white'}} variant="primary" onClick={() => fetchProducts(searchName)}>
        Search
      </Button>
    </InputGroup>
    <Button variant="secondary" onClick={() => setShowCategoryModal(true)}>
      Add Category
    </Button>
  </div>

  {/* Inventory Table */}
  <div className="card shadow-sm">
    <div className="card-header d-flex justify-content-between align-items-center">
      <h5 className="fw-bold" style={{ fontSize: 22 }}>Inventory</h5>
      <Button variant="success" onClick={handleShowAdd} className="d-flex align-items-center gap-1">
        <FaPlus />
      </Button>
    </div>
    <div className="card-body p-0">
      {error && <Alert variant="danger" className="m-3">{error}</Alert>}
      <Table hover className="mb-0 table-striped">
        <thead className="table-light">
          <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Supplier</th>
            <th>Quantity</th>
            <th style={{ width: 80 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-3">
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted py-3">No products found.</td>
            </tr>
          ) : (
            products.map((prod, idx) => (
              <tr key={prod.product_ID}>
                <td>{prod.product_Name}</td>
                <td>{prod.category_Name}</td>
                <td>₱ {prod.price}</td>
                <td>{prod.supplier_Company}</td>
                <td>{prod.product_Quantity}</td>
                <td className="position-relative">
                  <Button
                    variant="outline-success"
                    size="sm"
                    style={{ borderRadius: '50%'}}
                    onClick={() => setEditIndex(idx)}
                  >
                    <FaEdit />
                  </Button>
                  {editIndex === idx && (
                    <div
                      ref={editPopupRef}
                      className="position-absolute bg-white border rounded shadow p-2"
                      style={{ top: 0, right: 40, zIndex: 10, minWidth: 100 }}
                    >
                      <Button
                        variant="success"
                        size="sm"
                        className="w-100 mb-1"
                        onClick={() => {
                          handleEdit(prod, idx);
                          setEditIndex(null);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="w-100"
                        onClick={() => handleDelete(prod.product_ID)}
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

  {/* Add/Edit Product Modal */}
    {showAdd && (
    <AddEditProductModal
      show={showAdd}
      handleClose={() => {
        setShowAdd(false);
        setEditProduct(null); // ✅ important to clear edit state
      }}
      handleSave={handleSave}
      initial={editProduct}     // ✅ this passes the correct data
      categories={categories}
      suppliers={suppliers}
/>

    )}



  {/* Add/Edit Category Modal */}
  {showCategoryModal && (
    <AddEditCategoryModal
      show={showCategoryModal}
      handleClose={() => setShowCategoryModal(false)}
      handleSave={async (cat) => {
        await axios.post('http://localhost:5000/api/category', cat);
        await fetchCategories();
        setShowCategoryModal(false);
      }}
    />
  )}
</div>

  );
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);  // Debug log
  console.log('Token exists:', !!token);           // Debug log
  const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  console.log('Auth headers being sent:', headers); // Debug log
  return headers;
};

export default Products;