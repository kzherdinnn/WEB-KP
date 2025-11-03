import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AdminRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, user } = useAppContext();

  useEffect(() => {
    // Jika user sudah login dan role adalah admin
    if (user && userRole === 'admin') {
      // Hanya redirect jika sedang di home page
      if (location.pathname === '/') {
        console.log('🔄 Admin detected, redirecting to dashboard...');
        navigate('/admin', { replace: true });
      }
    }
  }, [user, userRole, location.pathname, navigate]);

  return null; // Component ini tidak render apa-apa
};

export default AdminRedirect;
