'use client'
import React, { useEffect, useState } from 'react';
import SignupComponent from '../../components/signup';

const SignupPage = () => {
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

  return <SignupComponent />;
};

export default SignupPage;
