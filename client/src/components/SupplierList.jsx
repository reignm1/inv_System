import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Table, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit, FaSearch } from 'react-icons/fa';
import AddEditSupplierModal from './AddEditSupplierModal';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const editPopupRef = useRef(null);

  useEffect(() => {
    fetchSuppliers();
    // Close edit popup on outside click
    const handleClickOutside = (event) => {
      if (editPopupRef.current && !editPopupRef.current.contains(event.target)) {
        setEditIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      setEditIndex(null);
    } catch (err) {
      setError('Failed to save supplier.');
      setLoading(false);
    }
  };

  const handleEdit = (sup, idx) => {
    setEditSupplier(sup);
    setEditIndex(idx);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setLoading(true);
      setError('');
      try {
        await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
        fetchSuppliers();
        setEditSupplier(null);
        setEditIndex(null);
      } catch (err) {
        setError('Failed to delete supplier.');
        setLoading(false);
      }
    }
  };

  const handleShowAdd = () => {
    setEditSupplier(null);
    setShowModal(true);
    setEditIndex(null);
  };

  // Filtered suppliers
  const filteredSuppliers = suppliers.filter(sup =>
    sup.supplier_Company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container my-4">
      {/* Search Bar */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <InputGroup>
          <Form.Control
            placeholder="Company Name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
          />
          <FaSearch style ={{position: 'absolute', left: 270, top: 10}}></FaSearch>
        </InputGroup>
      </div>

      {/* Supplier Table */}
      <div className="card shadow-sm">
        <div className="d-flex align-items-center justify-content-between px-4 py-2" style={{ borderBottom: '1px solid #eee' }}>
          <span className="fw-bold" style={{ fontSize: 21,}}>Suppliers</span>
          <Button variant="success" style= {{maxHeight: 30, position: 'absolute', right: 15}} onClick={handleShowAdd} >
            <FaPlus style={{ marginBottom: 9 }} />
          </Button>
        </div>
        {error && <Alert variant="danger" className="m-3">{error}</Alert>}
        {loading ? (
          <div className="text-center my-4"></div>
        ) : (
          <Table hover className="mb-0 table-striped" style={{ background: 'transparent' }}>
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact Person</th>
                <th>Contact Number</th>
                <th>Email</th>
                <th>Supplier Address</th>
                <th style={{ width: 80}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">No suppliers found.</td>
                </tr>
              ) : (
                filteredSuppliers.map((sup, idx) => (
                  <tr key={sup.supplier_ID}>
                    <td>{sup.supplier_Company}</td>
                    <td>{sup.contact_Person}</td>
                    <td>{sup.supplier_ContactNumber}</td>
                    <td>{sup.supplier_Email}</td>
                    <td>{sup.supplier_Address}</td>
                    <td style={{ position: 'relative' }}>
                      <Button
                        variant="outline-success"
                        size="sm"
                        style={{ borderRadius: '50%' }}
                        onClick={() => handleEdit(sup, idx)}
                      >
                        <FaEdit/>
                      </Button>
                      {/* Edit/Delete Popup */}
                      {editIndex === idx && (
                        <div
                          ref={editPopupRef}
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 40,
                            background: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: 8,
                            boxShadow: '0 2px 8px #0002',
                            zIndex: 10,
                            padding: 12,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8
                          }}
                        >
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => { setShowModal(true); setEditIndex(null); }}
                            style={{ minWidth: 70 }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(sup.supplier_ID)}
                            style={{ minWidth: 70 }}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </div>
      {/* Add/Edit Supplier Modal */}
      {showModal && (
        <AddEditSupplierModal
          show={showModal}
          handleClose={() => { setShowModal(false); setEditSupplier(null); }}
          handleSave={handleSave}
          initial={editSupplier}
        />
      )}
    </div>
  );
};

export default SupplierList;