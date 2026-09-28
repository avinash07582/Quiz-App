
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      // Fetch user data will happen in AuthProvider's useEffect or we can trigger it
      window.location.href = '/'; // Force reload to trigger AuthProvider fetch
    } else {
      navigate('/login?error=OAuthFailed');
    }
  }, [location, navigate, setUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 sm:px-6">
      <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-purple-500"></div>

      <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-400 text-center">
        Authenticating...
      </p>
    </div>
  );
};

export default AuthCallback;
