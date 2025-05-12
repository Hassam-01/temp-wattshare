
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import Navbar from '@/components/Navbar';

const Login = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (authState.user && !authState.isLoading) {
      navigate('/');
    }
  }, [authState.user, authState.isLoading, navigate]);

  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
