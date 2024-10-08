'use client'
import React, { useEffect, useState } from 'react';
import LoginComponent from '../../components/login';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  
  useEffect(() => {
    const token = localStorage.getItem('tokenStockify');

    if (token) {
      router.push('/dashboard');
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div> 
      </div>
    );
  }

  return <LoginComponent />;
};

export default LoginPage;
