import API from './api';

// Signup new user
export const signup = async (userData) => {
  const { data } = await API.post('/auth/signup', userData);
  localStorage.setItem('token', data.token);
  return data;
};

// Login user
export const login = async (userData) => {
  const { data } = await API.post('/auth/login', userData);
  localStorage.setItem('token', data.token);
  return data;
};

// Google OAuth login
export const googleLogin = async (profileObj) => {
  const { name, email } = profileObj;
  const { data } = await API.post('/auth/google', { name, email });
  localStorage.setItem('token', data.token);
  return data;
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
};
