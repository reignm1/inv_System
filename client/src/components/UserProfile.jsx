import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    user_Username: user?.user_Username || '',
    // Add other editable fields as needed
  });
  const [message, setMessage] = useState('');
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMessage, setPwMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!user) return <div>Loading...</div>;

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const onPwChange = e => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const handleSave = async () => {
    // Replace with your API endpoint
    const token = localStorage.getItem('token');
    const res = await fetch('/api/users/' + user.user_ID, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setMessage('Profile updated!');
      setEditMode(false);
      // Optionally update user in context
    } else {
      setMessage('Failed to update profile.');
    }
  };

  const handlePasswordChange = async e => {
    e.preventDefault();
    setPwMessage('');
    if (pwForm.newPassword.length < 6) {
      setPwMessage('New password must be at least 6 characters.');
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMessage('Passwords do not match.');
      return;
    }
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/users/${user.user_ID}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword
      })
    });
    if (res.ok) {
      setPwMessage('Password changed successfully!');
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      const data = await res.json();
      setPwMessage(data.message || 'Failed to change password.');
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: '2rem auto' }}>
      <div className="card-body">
        <h5 className="card-title">User Profile</h5>
        {message && <div className="alert alert-info">{message}</div>}
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Username:</strong>
            {editMode ? (
              <input
                name="user_Username"
                value={form.user_Username}
                onChange={onChange}
                className="form-control"
              />
            ) : (
              ' ' + user.user_Username
            )}
          </li>
          <li className="list-group-item"><strong>Role:</strong> {user.user_Role}</li>
          {/* Add more fields as needed */}
        </ul>
        {editMode ? (
          <div className="mt-3">
            <button className="btn btn-primary btn-sm me-2" onClick={handleSave}>Save</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        ) : (
          <button className="btn btn-outline-primary btn-sm mt-3" onClick={() => setEditMode(true)}>Edit Profile</button>
        )}
        <hr />
        <h6>Change Password</h6>
        <form onSubmit={handlePasswordChange}>
          <div className="mb-2">
            <input
              type="password"
              name="oldPassword"
              value={pwForm.oldPassword}
              onChange={onPwChange}
              className="form-control"
              placeholder="Current password"
              required
            />
          </div>
          <div className="mb-2">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={pwForm.newPassword}
              onChange={onPwChange}
              className="form-control"
              placeholder="New password"
              required
            />
            <button type="button" onClick={() => setShowPassword(v => !v)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="mb-2">
            <input
              type="password"
              name="confirmPassword"
              value={pwForm.confirmPassword}
              onChange={onPwChange}
              className="form-control"
              placeholder="Confirm new password"
              required
            />
          </div>
          <button className="btn btn-primary btn-sm" type="submit">Change Password</button>
        </form>
        {pwMessage && <div className="alert alert-info mt-2">{pwMessage}</div>}
      </div>
    </div>
  );
};

export default UserProfile;