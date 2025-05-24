import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const initialFormState = {
  product_Name: '',
  category_ID: '',
  supplier_ID: '',
  price: '',
  product_Quantity: ''
};

const AddEditProductModal = ({ show, handleClose, handleSave, initial, categories = [], suppliers = [] }) => {
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(initial ? {
      product_Name: initial.product_Name || '',
      category_ID: initial.category_ID || '',
      supplier_ID: initial.supplier_ID || '',
      price: initial.price || '',
      product_Quantity: initial.product_Quantity || ''
    } : initialFormState);
    setError('');
    setLoading(false);
  }, [initial, show]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async () => {
    if (!form.product_Name.trim()) { setError('Product name is required.'); return; }
    if (!form.category_ID) { setError('Category is required.'); return; }
    if (!form.supplier_ID) { setError('Supplier is required.'); return; }
    if (form.price && Number(form.price) < 0) { setError('Price must be a positive number.'); return; }
    if (form.product_Quantity && Number(form.product_Quantity) < 0) { setError('Quantity must be a positive number.'); return; }
    setError('');
    setLoading(true);
    try {
      await handleSave(form);
      setLoading(false);
      setForm(initialFormState);
      handleClose();
    } catch (e) {
      setError('Failed to save product.');
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setForm(initialFormState);
    setError('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initial ? 'Edit' : 'Add'} Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              name="product_Name"
              value={form.product_Name}
              onChange={onChange}
              isInvalid={!!error && !form.product_Name.trim()}
              autoFocus
            />
            <Form.Control.Feedback type="invalid">
              Product name is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category_ID"
              value={form.category_ID}
              onChange={onChange}
              isInvalid={!!error && !form.category_ID}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.category_ID} value={cat.category_ID}>{cat.category_Name}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Category is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Supplier</Form.Label>
            <Form.Select
              name="supplier_ID"
              value={form.supplier_ID}
              onChange={onChange}
              isInvalid={!!error && !form.supplier_ID}
            >
              <option value="">Select Supplier</option>
              {suppliers.map(sup => (
                <option key={sup.supplier_ID} value={sup.supplier_ID}>{sup.supplier_Company}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Supplier is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Price</Form.Label>
            <Form.Control
              name="price"
              type="number"
              value={form.price}
              onChange={onChange}
              isInvalid={!!error && form.price && Number(form.price) < 0}
            />
            <Form.Control.Feedback type="invalid">
              Price must be a positive number.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              name="product_Quantity"
              type="number"
              value={form.product_Quantity}
              onChange={onChange}
              isInvalid={!!error && form.product_Quantity && Number(form.product_Quantity) < 0}
            />
            <Form.Control.Feedback type="invalid">
              Quantity must be a positive number.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditProductModal;