import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit } from 'react-icons/fa';
import AddEditUserModal from './AddEditUserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const editPopupRef = useRef(null);

  useEffect(() => {
    fetchUsers();
    // Close edit popup on outside click
    const handleClickOutside = (event) => {
      if (editPopupRef.current && !editPopupRef.current.contains(event.target)) {
        setEditIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users.');
    }
    setLoading(false);
  };

  const handleSave = async (user) => {
    setLoading(true);
    setError('');
    try {
      if (editUser) {
        await axios.put(`http://localhost:5000/api/users/${editUser.user_ID}`, user);
      } else {
        await axios.post('http://localhost:5000/api/users', user);
      }
      fetchUsers();
      setShowModal(false);
      setEditUser(null);
      setEditIndex(null);
    } catch (err) {
      setError('Failed to save user.');
      setLoading(false);
    }
  };

  const handleEdit = (user, idx) => {
    setEditUser(user);
    setEditIndex(idx);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      setError('');
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers();
        setEditUser(null);
        setEditIndex(null);
      } catch (err) {
        setError('Failed to delete user.');
        setLoading(false);
      }
    }
  };

  const handleShowAdd = () => {
    setEditUser(null);
    setShowModal(true);
    setEditIndex(null);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div className="d-flex mb-3 gap-3 align-items-center">
        <span className="fw-bold" style={{ fontSize: 22 }}>User Management</span>
        <Button
          variant="light"
          onClick={handleShowAdd}
          style={{ borderRadius: '50%', fontSize: 22, width: 38, height: 38, marginLeft: 'auto' }}
        >
          <FaPlus />
        </Button>
      </div>
      {/* Table */}
      <div style={{ background: '#f8f9f9', borderRadius: 12, padding: 0, boxShadow: '0 2px 8px #0001' }}>
        {error && <Alert variant="danger" className="m-3">{error}</Alert>}
        {loading ? (
          <div className="text-center my-4"><Spinner animation="border" /></div>
        ) : (
          <Table hover responsive className="mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">No users found.</td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr key={user.user_ID}>
                    <td>{user.user_FirstName}</td>
                    <td>{user.user_LastName}</td>
                    <td>{user.user_Username}</td>
                    <td>{user.user_Contact}</td>
                    <td>{user.user_Email}</td>
                    <td>{user.user_Role}</td>
                    <td style={{ position: 'relative' }}>
                      <Button
                        variant="outline-success"
                        size="sm"
                        style={{ borderRadius: '50%' }}
                        onClick={() => handleEdit(user, idx)}
                      >
                        <FaEdit />
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
                            onClick={() => handleDelete(user.user_ID)}
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
      {/* Add/Edit User Modal */}
      {showModal && (
        <AddEditUserModal
          show={showModal}
          handleClose={() => { setShowModal(false); setEditUser(null); }}
          handleSave={handleSave}
          initial={editUser}
        />
      )}
    </div>
  );
};

export default UserManagement;