import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import client from '../api/client';
import '../styles/VerifyCode.css'; 

export default function VerifyCode() {
  const { state } = useLocation();
  const email     = state?.email;
  const [code, setCode] = useState(['', '', '', '','','']);
  const [err, setErr]   = useState('');
  const nav = useNavigate();
  const inputs = useRef([]);

  const handleChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const newCode = [...code];
    newCode[i] = v;
    setCode(newCode);
    if (v && i < 3) inputs.current[i + 1].focus();
  };

  const handleVerify = async e => {
    e.preventDefault();
    const joined = code.join('');
    if (joined.length < 4) return setErr('Mã phải đủ 6 chữ số');
    try {
      await client.post('/confirm-verification-code', { email, code: joined });
      nav('/reset-password', { state: { email } });
    } catch (e) {
      setErr(e.response?.data?.message || 'Invalid code');
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Verification</h2>
        <p>Enter the 6-digit code that you received on your email.</p>
        {err && <p className="link" style={{ color: 'red' }}>{err}</p>}
        <form onSubmit={handleVerify}>
          <div className="code-inputs">
            {code.map((c, i) => (
              <input
                key={i}
                ref={el => (inputs.current[i] = el)}
                value={c}
                onChange={e => handleChange(i, e.target.value)}
                maxLength="1"
              />
            ))}
          </div>
          <button className="btn" type="submit">VERIFY</button>
        </form>
        <div className="link" onClick={() => nav('/forgot-password')}>
          Didn’t receive code? Resend
        </div>
      </div>
    </div>
  );
}
