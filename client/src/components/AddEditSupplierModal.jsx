import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const initialFormState = {
  supplier_Company: '',
  contact_Person: '',
  supplier_ContactNumber: '',
  supplier_Email: '',
  supplier_Address: ''
};

const AddEditSupplierModal = ({ show, handleClose, handleSave, initial }) => {
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(initial ? {
      supplier_Company: initial.supplier_Company || '',
      contact_Person: initial.contact_Person || '',
      supplier_ContactNumber: initial.supplier_ContactNumber || '',
      supplier_Email: initial.supplier_Email || '',
      supplier_Address: initial.supplier_Address || ''
    } : initialFormState);
    setError('');
    setLoading(false);
  }, [initial, show]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async () => {
    if (!form.supplier_Company.trim()) {
      setError('Company name is required.');
      return;
    }
    if (!form.contact_Person.trim()) {
      setError('Contact person is required.');
      return;
    }
    if (!form.supplier_Email.trim() || !emailRegex.test(form.supplier_Email)) {
      setError('A valid email is required.');
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
      setError('Failed to save supplier.');
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
        <Modal.Title>{initial ? 'Edit' : 'Add'} Supplier</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              name="supplier_Company"
              value={form.supplier_Company}
              onChange={onChange}
              isInvalid={!!error && !form.supplier_Company.trim()}
              autoFocus
            />
            <Form.Control.Feedback type="invalid">
              Company name is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Contact Person</Form.Label>
            <Form.Control
              name="contact_Person"
              value={form.contact_Person}
              onChange={onChange}
              isInvalid={!!error && !form.contact_Person.trim()}
            />
            <Form.Control.Feedback type="invalid">
              Contact person is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              name="supplier_ContactNumber"
              value={form.supplier_ContactNumber}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="supplier_Email"
              value={form.supplier_Email}
              onChange={onChange}
              isInvalid={!!error && (!form.supplier_Email.trim() || !emailRegex.test(form.supplier_Email))}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Address</Form.Label>
            <Form.Control
              name="supplier_Address"
              value={form.supplier_Address}
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

export default AddEditSupplierModal;