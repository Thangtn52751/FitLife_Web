import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import '../styles/ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [err, setErr]     = useState('');
  const nav = useNavigate();

  const handleSendCode = async e => {
    e.preventDefault();
    try {
      await client.post('/send-verification-code', { email });
      nav('/verify-code', { state: { email } });
    } catch (e) {
      setErr(e.response?.data?.message || 'Gửi mã thất bại');
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a verification code.</p>
        {err && <p className="link" style={{ color: 'red' }}>{err}</p>}
        <form onSubmit={handleSendCode}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="btn" type="submit">
            CONTINUE
          </button>
        </form>
      </div>
    </div>
  );
}
