import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import Login          from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import VerifyCode     from '../pages/VerifyCode';
import ResetPassword  from '../pages/ResetPassword';
import Success        from '../pages/Success';
import Dashboard      from '../pages/Dashboard';
import Layout         from '../components/Layout';
import SongList from '../pages/SongList';


export default function MainNav() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Auth flow */}
        <Route
          path="/verify-code"
          element={
            <ProtectedRoute>
              <VerifyCode />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          }
        />

        {/* App (protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route 
        path='/songs' 
        element ={
          <ProtectedRoute>
        <Layout>
        <SongList/>
        </Layout>
        </ProtectedRoute>
        }
        />
      </Routes>
    </BrowserRouter>
  );
}
