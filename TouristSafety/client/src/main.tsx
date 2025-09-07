// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/authContext';
import './index.css';
import ProtectedRoute from './components/protectedRoutes';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProtectedRoute>
        <App />
        </ProtectedRoute>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
