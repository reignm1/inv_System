import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const initialFormState = {
  supplier_ID: '',
  quantity_Ordered: '',
  order_Date: '', // Will be set to today in useEffect
  unit_Price: '',
  status: 'Pending',
};

const AddEditOrderModal = ({ show, handleClose, handleSave, initial, suppliers = [], products = [] }) => {
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setForm(initial ? {
      supplier_ID: initial.supplier_ID || '',
      quantity_Ordered: initial.quantity_Ordered || '',
      order_Date: initial.order_Date || today,
      unit_Price: initial.unit_Price || '',
      status: initial.status || 'Pending',
    } : { ...initialFormState, order_Date: today });
    
    setError('');
    setLoading(false);
  }, [initial, show]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async () => {
    // Validation
    if (!form.supplier_ID) {
      setError('Supplier is required.');
      return;
    }
    if (!form.quantity_Ordered || isNaN(form.quantity_Ordered) || Number(form.quantity_Ordered) <= 0) {
      setError('Quantity must be a positive number.');
      return;
    }
    if (form.unit_Price && (isNaN(form.unit_Price) || Number(form.unit_Price) <= 0)) {
      setError('Unit price must be a positive number.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const cleanedForm = {
        ...form,
        quantity_Ordered: form.quantity_Ordered.toString().trim(),
        unit_Price: form.unit_Price?.toString().trim() || '',
      };

      await handleSave(cleanedForm);
      setLoading(false);

      // Reset form only if adding
      if (!initial) setForm({ ...initialFormState, order_Date: new Date().toISOString().split('T')[0] });

      handleClose();
    } catch (e) {
      setError('Failed to save order.');
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setForm({ ...initialFormState, order_Date: new Date().toISOString().split('T')[0] });
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
                <option key={sup.supplier_ID} value={sup.supplier_ID}>
                  {sup.supplier_Company}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Supplier is required.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              name="quantity_Ordered"
              type="number"
              value={form.quantity_Ordered}
              onChange={onChange}
              isInvalid={!!error && (!form.quantity_Ordered || Number(form.quantity_Ordered) <= 0)}
            />
            <Form.Control.Feedback type="invalid">
              Quantity must be a positive number.
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
              isInvalid={!!error && form.unit_Price && Number(form.unit_Price) <= 0}
            />
            <Form.Control.Feedback type="invalid">
              Unit price must be a positive number.
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
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditOrderModal;
