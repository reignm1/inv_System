import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import AddEditSupplierModal from './AddEditSupplierModal';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      setError('Failed to fetch suppliers.');
    }
    setLoading(false);
  };

  const handleSave = async (supplier) => {
    setLoading(true);
    setError('');
    try {
      if (editSupplier) {
        await axios.put(`http://localhost:5000/api/suppliers/${editSupplier.supplier_ID}`, supplier);
      } else {
        await axios.post('http://localhost:5000/api/suppliers', supplier);
      }
      fetchSuppliers();
      setShowModal(false);
      setEditSupplier(null);
    } catch (err) {
      setError('Failed to save supplier.');
      setLoading(false);
    }
  };

  const handleEdit = (sup) => {
    setEditSupplier(sup);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setLoading(true);
      setError('');
      try {
        await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
        fetchSuppliers();
      } catch (err) {
        setError('Failed to delete supplier.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 mb-4">
      <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">Supplier List</h5>
        <Button variant="primary" size="sm" onClick={() => { setEditSupplier(null); setShowModal(true); }}>Add Supplier</Button>
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
                <th>Contact</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">No suppliers found.</td>
                </tr>
              ) : (
                suppliers.map(sup => (
                  <tr key={sup.supplier_ID}>
                    <td>{sup.supplier_ID}</td>
                    <td>{sup.supplier_Company}</td>
                    <td>{sup.contact_Person}</td>
                    <td>{sup.supplier_Email}</td>
                    <td>
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleEdit(sup)}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(sup.supplier_ID)}>Delete</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </div>
      <AddEditSupplierModal
        show={showModal}
        handleClose={() => { setShowModal(false); setEditSupplier(null); }}
        handleSave={handleSave}
        initial={editSupplier}
      />
    </div>
  );
};

export default SupplierList;