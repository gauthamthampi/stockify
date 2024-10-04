'use client'
import React, { useEffect, useState } from 'react';
import LoginComponent from '../../components/login';

const LoginPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 2000); 

    return () => clearTimeout(timer); 
  }, []);

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
