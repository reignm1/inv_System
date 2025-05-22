import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import AddEditProductModal from './AddEditProductModal';

const ProductList = ({ categories = [], suppliers = [] }) => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to fetch products.');
    }
    setLoading(false);
  };

  const handleSave = async (product) => {
    setLoading(true);
    setError('');
    try {
      if (editProduct) {
        await axios.put(`http://localhost:5000/api/products/${editProduct.product_ID}`, product);
      } else {
        await axios.post('http://localhost:5000/api/products', product);
      }
      fetchProducts();
      setShowModal(false);
      setEditProduct(null);
    } catch (err) {
      setError('Failed to save product.');
      setLoading(false);
    }
  };

  const handleEdit = (prod) => {
    setEditProduct(prod);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      setError('');
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 mb-4">
      <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">Product List</h5>
        <Button variant="primary" size="sm" onClick={() => { setEditProduct(null); setShowModal(true); }}>Add Product</Button>
      </div>
      <div className="card-body">
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="text-center my-4"><Spinner animation="border" /></div>
        ) : (
          <Table hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">No products found.</td>
                </tr>
              ) : (
                products.map(prod => (
                  <tr key={prod.product_ID}>
                    <td>{prod.product_ID}</td>
                    <td>{prod.product_Name}</td>
                    <td>{prod.category_Name}</td>
                    <td>{prod.supplier_Company}</td>
                    <td>{prod.price}</td>
                    <td>{prod.product_Quantity}</td>
                    <td>
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleEdit(prod)}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(prod.product_ID)}>Delete</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </div>
      <AddEditProductModal
        show={showModal}
        handleClose={() => { setShowModal(false); setEditProduct(null); }}
        handleSave={handleSave}
        initial={editProduct}
        categories={categories}
        suppliers={suppliers}
      />
    </div>
  );
};

export default ProductList;