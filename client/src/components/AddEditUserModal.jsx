import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-()\s]{7,20}$/;

const initialFormState = {
  user_FirstName: '',
  user_LastName: '',
  user_MiddleName: '',
  user_Address: '',
  user_Contact: '',
  user_Username: '',
  user_Password: '',
  user_Role: 'User',
};

const AddEditUserModal = ({ show, handleClose, handleSave, initial }) => {
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(initial ? {
      user_FirstName: initial.user_FirstName || '',
      user_LastName: initial.user_LastName || '',
      user_MiddleName: initial.user_MiddleName || '',
      user_Address: initial.user_Address || '',
      user_Contact: initial.user_Contact || '',
      user_Username: initial.user_Username || '',
      user_Password: '',
      user_Role: initial.user_Role || 'User',
    } : initialFormState);
    setError('');
    setLoading(false);
  }, [initial, show]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async () => {
    // Validation
    if (!form.user_FirstName.trim()) {
      setError('First name is required.');
      return;
    }
    if (!form.user_LastName.trim()) {
      setError('Last name is required.');
      return;
    }
    if (!form.user_Username.trim()) {
      setError('Username is required.');
      return;
    }
    if (form.user_Password && form.user_Password.length > 0 && form.user_Password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.user_Address && !emailRegex.test(form.user_Address)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (form.user_Contact && !phoneRegex.test(form.user_Contact)) {
      setError('Please enter a valid contact number.');
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
      setError('Failed to save user.');
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
        <Modal.Title>{initial ? 'Edit' : 'Add'} User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              name="user_FirstName"
              value={form.user_FirstName}
              onChange={onChange}
              isInvalid={!!error && !form.user_FirstName.trim()}
              autoFocus
            />
            <Form.Control.Feedback type="invalid">
              First name is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              name="user_LastName"
              value={form.user_LastName}
              onChange={onChange}
              isInvalid={!!error && !form.user_LastName.trim()}
            />
            <Form.Control.Feedback type="invalid">
              Last name is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Middle Name</Form.Label>
            <Form.Control
              name="user_MiddleName"
              value={form.user_MiddleName}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              name="user_Address"
              value={form.user_Address}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Contact</Form.Label>
            <Form.Control
              name="user_Contact"
              value={form.user_Contact}
              onChange={onChange}
              isInvalid={!!error && form.user_Contact && !phoneRegex.test(form.user_Contact)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid contact number.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="user_Username"
              value={form.user_Username}
              onChange={onChange}
              isInvalid={!!error && !form.user_Username.trim()}
            />
            <Form.Control.Feedback type="invalid">
              Username is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="user_Password"
              type="password"
              value={form.user_Password}
              onChange={onChange}
              isInvalid={!!error && form.user_Password && form.user_Password.length < 6}
            />
            <Form.Text muted>Leave blank to keep current password.</Form.Text>
            <Form.Control.Feedback type="invalid">
              Password must be at least 6 characters.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Role</Form.Label>
            <Form.Select name="user_Role" value={form.user_Role} onChange={onChange}>
              <option value="SuperAdmin">SuperAdmin</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Pending">Pending</option>
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

export default AddEditUserModal;