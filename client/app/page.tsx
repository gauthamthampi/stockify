'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 


const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('tokenStockify');

    if (!token) {
      router.push('/login');
    } else {
      router.push('/dashboard')
    }
  }, [router]);

};

export default HomePage;
