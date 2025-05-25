import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const initialFormState = {
  product_Name: '',
  category_ID: '',
  supplier_ID: '',
  price: '',
  product_Quantity: ''
};

const AddEditProductModal = ({
  show,
  handleClose,
  handleSave,
  initial,
  categories = [],
  suppliers = []
}) => {
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

useEffect(() => {
  if (initial) {
    setForm({
      product_ID: initial.product_ID || '',
      product_Name: initial.product_Name || '',
      category_ID: initial.category_ID || '',
      supplier_ID: initial.supplier_ID || '',
      price: initial.price || '',
      product_Quantity: initial.product_Quantity || ''
    });
  } else {
    setForm({
      product_Name: '',
      category_ID: '',
      supplier_ID: '',
      price: '',
      product_Quantity: ''
    });
  }
}, [initial]);


  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched(true);
  };

  const validate = () => {
    if (!form.product_Name.trim()) return 'Product name is required.';
    if (!form.category_ID) return 'Category is required.';
    if (!form.supplier_ID) return 'Supplier is required.';
    if (form.price && Number(form.price) < 0) return 'Price must be a positive number.';
    if (form.product_Quantity && Number(form.product_Quantity) < 0) return 'Quantity must be a positive number.';
    return '';
  };

  const onSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);
    try {
      await handleSave(form);
      setLoading(false);
      setForm(initialFormState);
      handleClose();
    } catch {
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
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              name="product_Name"
              value={form.product_Name}
              onChange={onChange}
              isInvalid={touched && !form.product_Name.trim()}
              autoFocus
              placeholder="Enter product name"
            />
            <Form.Control.Feedback type="invalid">
              Product name is required.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category_ID"
              value={form.category_ID}
              onChange={onChange}
              isInvalid={touched && !form.category_ID}
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

          <Form.Group className="mb-3">
            <Form.Label>Supplier</Form.Label>
            <Form.Select
              name="supplier_ID"
              value={form.supplier_ID}
              onChange={onChange}
              isInvalid={touched && !form.supplier_ID}
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

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              name="price"
              type="number"
              value={form.price}
              onChange={onChange}
              isInvalid={touched && form.price && Number(form.price) < 0}
              placeholder="Enter price"
            />
            <Form.Control.Feedback type="invalid">
              Price must be a positive number.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              name="product_Quantity"
              type="number"
              value={form.product_Quantity}
              onChange={onChange}
              isInvalid={touched && form.product_Quantity && Number(form.product_Quantity) < 0}
              placeholder="Enter quantity"
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
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditProductModal;
