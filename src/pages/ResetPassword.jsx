import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import client from '../api/client';
import '../styles/ResetPassword.css';

export default function ResetPassword() {
  const { state } = useLocation();
  const email     = state?.email;
  const [pw, setPw]           = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr]         = useState('');
  const nav = useNavigate();

  const handleReset = async e => {
    e.preventDefault();
    if (pw !== confirm) {
      setErr('Passwords do not match');
      return;
    }
    try {
      await client.post('/reset-password', { email, newPassword: pw });
      nav('/success');
    } catch (e) {
      setErr(e.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>New Password</h2>
        {err && <p className="link" style={{ color: 'red' }}>{err}</p>}
        <form onSubmit={handleReset}>
          <div className="form-group">
            <label>Enter new password (min 8 characters)</label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>
          <button className="btn" type="submit">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
