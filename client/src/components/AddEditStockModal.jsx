import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const initialFormState = {
  product_ID: '',
  stock_Quantity: '',
  last_RestockDate: ''
};

const AddEditStockModal = ({ show, handleClose, handleSave, initial, products }) => {
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        product_ID: initial.product_ID || '',
        stock_Quantity: initial.stock_Quantity || '',
        last_RestockDate: initial.last_RestockDate
          ? initial.last_RestockDate.split('T')[0] // Format date string (YYYY-MM-DD)
          : ''
      });
    } else {
      setForm(initialFormState);
    }
    setError('');
    setLoading(false);
  }, [initial, show]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async () => {
    if (!form.product_ID) {
      setError('Product is required.');
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
        <Modal.Title>{initial ? 'Edit Stock' : 'Add Stock'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Product</Form.Label>
            <Form.Select
              name="product_ID"
              value={form.product_ID}
              onChange={onChange}
              disabled={!!initial} // disable product change when editing
            >
              <option value="">Select a Product</option>
              {products.map(product => (
                <option key={product.product_ID} value={product.product_ID}>
                  {product.product_Name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              name="stock_Quantity"
              type="number"
              min="0"
              value={form.stock_Quantity}
              onChange={onChange}
            />
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
