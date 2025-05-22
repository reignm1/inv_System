import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const initialFormState = {
  supplier_ID: '',
  product_ID: '',
  quantity_Ordered: '',
  order_Date: '',
  unit_Price: '',
  status: 'Pending'
};

const AddEditOrderModal = ({ show, handleClose, handleSave, initial, suppliers = [], products = [] }) => {
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(initial ? {
      supplier_ID: initial.supplier_ID || '',
      product_ID: initial.product_ID || '',
      quantity_Ordered: initial.quantity_Ordered || '',
      order_Date: initial.order_Date || '',
      unit_Price: initial.unit_Price || '',
      status: initial.status || 'Pending'
    } : initialFormState);
    setError('');
    setLoading(false);
  }, [initial, show]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async () => {
    if (!form.supplier_ID) {
      setError('Supplier is required.');
      return;
    }
    if (!form.product_ID) {
      setError('Product is required.');
      return;
    }
    if (!form.quantity_Ordered || Number(form.quantity_Ordered) < 0) {
      setError('Quantity is required and must be positive.');
      return;
    }
    if (form.unit_Price && Number(form.unit_Price) < 0) {
      setError('Unit price must be positive.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await handleSave(form);
      setLoading(false);
      setForm(initialFormState);
      handleClose();
    } catch (e) {
      setError('Failed to save order.');
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
        <Modal.Title>{initial ? 'Edit' : 'Add'} Purchase Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Supplier</Form.Label>
            <Form.Select
              name="supplier_ID"
              value={form.supplier_ID}
              onChange={onChange}
              isInvalid={!!error && !form.supplier_ID}
              autoFocus
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
            <Form.Label>Product</Form.Label>
            <Form.Select
              name="product_ID"
              value={form.product_ID}
              onChange={onChange}
              isInvalid={!!error && !form.product_ID}
            >
              <option value="">Select Product</option>
              {products.map(prod => (
                <option key={prod.product_ID} value={prod.product_ID}>{prod.product_Name}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Product is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              name="quantity_Ordered"
              type="number"
              value={form.quantity_Ordered}
              onChange={onChange}
              isInvalid={!!error && (!form.quantity_Ordered || Number(form.quantity_Ordered) < 0)}
            />
            <Form.Control.Feedback type="invalid">
              Quantity is required and must be positive.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Order Date</Form.Label>
            <Form.Control
              name="order_Date"
              type="date"
              value={form.order_Date}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Unit Price</Form.Label>
            <Form.Control
              name="unit_Price"
              type="number"
              value={form.unit_Price}
              onChange={onChange}
              isInvalid={!!error && form.unit_Price && Number(form.unit_Price) < 0}
            />
            <Form.Control.Feedback type="invalid">
              Unit price must be positive.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={form.status} onChange={onChange}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
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

export default AddEditOrderModal;