import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// ✅ Attach token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
