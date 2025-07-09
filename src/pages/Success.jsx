import { useNavigate } from 'react-router-dom';
import '../styles/Success.css'; 

export default function Success() {
  const nav = useNavigate();
  return (
    <div className="auth-container">
      <div className="card">
        <svg viewBox="0 0 24 24">
          <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2" fill="none"/>
        </svg>
        <h2>Successfully</h2>
        <p>Your password has been reset successfully.</p>
        <button className="btn" onClick={() => nav('/')}>
          CONTINUE
        </button>
      </div>
    </div>
  );
}
