import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const name = params.get('name');

    if (token && name) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', name);

      // Clean URL, remove query params
      window.history.replaceState({}, document.title, '/dashboard');

      navigate('/dashboard');
    } 
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default OAuthHandler;
