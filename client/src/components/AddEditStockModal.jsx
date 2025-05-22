import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const initialFormState = {
  product_ID: '',
  stock_Quantity: '',
  last_RestockDate: ''
};

const AddEditStockModal = ({ show, handleClose, handleSave, initial }) => {
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(initial ? {
      product_ID: initial.product_ID || '',
      stock_Quantity: initial.stock_Quantity || '',
      last_RestockDate: initial.last_RestockDate || ''
    } : initialFormState);
    setError('');
    setLoading(false);
  }, [initial, show]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async () => {
    if (!form.product_ID) {
      setError('Product ID is required.');
      return;
    }
    if (!form.stock_Quantity || Number(form.stock_Quantity) < 0) {
      setError('Quantity is required and must be positive.');
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
      setError('Failed to save stock.');
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
        <Modal.Title>{initial ? 'Edit' : 'Add'} Stock</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Product ID</Form.Label>
            <Form.Control
              name="product_ID"
              value={form.product_ID}
              onChange={onChange}
              isInvalid={!!error && !form.product_ID}
              autoFocus
            />
            <Form.Control.Feedback type="invalid">
              Product ID is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              name="stock_Quantity"
              type="number"
              value={form.stock_Quantity}
              onChange={onChange}
              isInvalid={!!error && (!form.stock_Quantity || Number(form.stock_Quantity) < 0)}
            />
            <Form.Control.Feedback type="invalid">
              Quantity is required and must be positive.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Last Restock Date</Form.Label>
            <Form.Control
              name="last_RestockDate"
              type="date"
              value={form.last_RestockDate}
              onChange={onChange}
            />
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

export default AddEditStockModal;