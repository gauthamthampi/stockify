'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Sidebar from '../../components/home/sidebar';
import Customers from '../../components/home/customers';

const CustomerPage = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('tokenStockify');

    if (!token) {
      router.push('/login');
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="loader"></div> 
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-1/4 bg-black text-white">
        <Sidebar activeComponent="customers" />
      </div>
      <div className="w-3/4">
        <Customers />
      </div>
    </div>
  );
};

export default CustomerPage;
