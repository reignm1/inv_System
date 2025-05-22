import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const AddEditCategoryModal = ({ show, handleClose, handleSave, initial }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setName(initial ? initial.category_Name : '');
    setError('');
  }, [initial, show]);

  const onSave = () => {
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }
    handleSave({ category_Name: name });
    setName('');
    setError('');
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initial ? 'Edit' : 'Add'} Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter category name"
              isInvalid={!!error}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={onSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditCategoryModal;