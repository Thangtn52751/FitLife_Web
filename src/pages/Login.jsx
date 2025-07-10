import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import '../styles/Login.css';
import logo from '../assets/logo.png';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const nav = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const response = await client.post('/login', { email, password });
      const { token, user } = response.data.data;

      // lưu token, role, và toàn bộ user object lên localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('user', JSON.stringify(user));

      nav('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response || err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Login thất bại không rõ lý do'
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={logo} alt="FitLife Logo" className="logo" />
      </div>
      <div className="login-right">
        <div className="card login-card">
          <h2>Welcome Back!</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="link error-text">{error}</p>}
            <div className="link" onClick={() => nav('/forgot-password')}>
              Forgot Password?
            </div>
            <button className="btn" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}