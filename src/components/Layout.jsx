import React from 'react';
import { NavLink } from 'react-router-dom';
import defaultAvatar from '../assets/logo.png';
import '../styles/Layout.css';

const menuItems = [
  { to: '/dashboard', label: 'Thống kê',  icon: '📊' },
  { to: '/exercises', label: 'Bài tập',    icon: '🏋️' },
  { to: '/users',     label: 'Tài khoản', icon: '👤' },
  { to: '/songs',     label: 'Bài hát',   icon: '🎵' },
];

export default function Layout({ children }) {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : {};
  const email = user.email || 'Admin';
  const avatarUrl = user.image || defaultAvatar;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">FitLife</div>
        <nav className="nav-menu">
          {menuItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'nav-item active' : 'nav-item'
              }
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="logout">
          <NavLink to="/" className="nav-item">
            <span className="icon">⏻</span>
            <span className="label">Logout</span>
          </NavLink>
        </div>
      </aside>
      <div className="main">
        <header className="header">
          <div className="profile">
            <span className="profile-email">{email}</span>
            <div className="avatar">
              <img src={avatarUrl} alt="avatar" />
            </div>
          </div>
        </header>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
