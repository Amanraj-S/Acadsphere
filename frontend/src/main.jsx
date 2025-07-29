import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

// ✅ Set base URL for API requests
axios.defaults.baseURL = 'https://acadsphere-1.onrender.com'; // Change in local dev if needed
axios.defaults.withCredentials = true; // Send cookies

// ✅ Automatically attach JWT token from localStorage
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
