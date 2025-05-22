import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Alert, Card } from 'react-bootstrap';
import AddEditUserModal from './AddEditUserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchUsers(); }, []);

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
    } catch (err) {
      setError('Failed to save user.');
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      setError('');
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user.');
        setLoading(false);
      }
    }
  };

  return (
    <Card className="shadow-sm border-0 rounded-4 mb-4">
      <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">User Management</h5>
        <Button variant="primary" size="sm" onClick={() => { setEditUser(null); setShowModal(true); }}>Add User</Button>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="text-center my-4"><Spinner animation="border" /></div>
        ) : (
          <Table hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.user_ID}>
                    <td>{user.user_ID}</td>
                    <td>{user.user_FirstName} {user.user_LastName}</td>
                    <td>{user.user_Email}</td>
                    <td>{user.user_Role}</td>
                    <td>
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleEdit(user)}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user.user_ID)}>Delete</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
      <AddEditUserModal
        show={showModal}
        handleClose={() => { setShowModal(false); setEditUser(null); }}
        handleSave={handleSave}
        initial={editUser}
      />
    </Card>
  );
};

export default UserManagement;