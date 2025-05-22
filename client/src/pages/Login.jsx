import React, { useState } from 'react';
import '../styles/login.css';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const history = useHistory();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token); // or sessionStorage
        history.push('/');
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setError('Network error.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="/logo192.png" alt="MarketTrack Logo" className="login-logo" />
        <div className="login-title">MarketTrack</div>
        <div className="login-subtitle">
          Stay organized. Track products. Simplify inventory.
        </div>
        <form className="login-form-card" onSubmit={handleSubmit}>
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          <div className="login-input-group">
            <FaUser />
            <input
              className="login-input"
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="login-input-group">
            <FaLock />
            <input
              className="login-input"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => setShowPassword(v => !v)}
              tabIndex={0}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="login-form-row">
            <label>
              Remember Me?
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                style={{ marginLeft: 4 }}
              />
            </label>
            <button
              type="button"
              className="btn btn-link p-0"
              style={{ color: '#fff', textDecoration: 'underline', fontWeight: 600, background: 'none', border: 'none' }}
              onClick={() => setShowForgot(true)}
            >
              Forgot password?
            </button>
          </div>
          <div className="login-btn-row">
            <button className="login-btn" type="submit">Login</button>
            <button className="login-btn" type="button" onClick={() => setForm({ username: '', password: '' })}>Cancel</button>
          </div>
        </form>
        {showForgot && (
          <div style={{ marginTop: 16, color: '#25877b', background: '#fff', padding: 12, borderRadius: 8 }}>
            Please contact your administrator to reset your password.
            <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => setShowForgot(false)}>Close</button>
          </div>
        )}
      </div>
      <div className="login-right" style={{
        flex: 1,
        background: `url(${process.env.PUBLIC_URL}/login-bg.jpg) center center/cover no-repeat`,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        borderRadius: 0
      }}></div>
    </div>
  );
};

export default Login;