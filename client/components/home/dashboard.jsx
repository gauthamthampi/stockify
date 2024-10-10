import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { localhost } from '@/url';

const Dashboard = () => {
  // States for the statistics
  const [inventoryCount, setInventoryCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalStockQuantity, setTotalStockQuantity] = useState(0);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Add an error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('tokenStockify')
        const response = await axios.post(localhost+'/api/dashboard/fetchDashboardData',{},{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); 
        const { totalItemsSold, totalCustomers, totalProfit, totalInventoryItems } = response.data;
        console.log(response.data);
        
        setInventoryCount(totalInventoryItems);
        setCustomerCount(totalCustomers);
        setTotalProfit(totalProfit);
        setTotalStockQuantity(totalItemsSold);
        setLoading(false); // Stop loading
      } catch (err) {
        setError('Error fetching data'); // Handle error
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-black text-white h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Dashboard Statistics (Top 4 Boxes aligned horizontally) */}
      <div className="flex justify-between space-x-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex-1 text-center">
          <h2 className="text-lg font-semibold mb-2">Items in Inventory</h2>
          <p className="text-4xl font-bold">{inventoryCount}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex-1 text-center">
          <h2 className="text-lg font-semibold mb-2">Customers</h2>
          <p className="text-4xl font-bold">{customerCount}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex-1 text-center">
          <h2 className="text-lg font-semibold mb-2">Profit Through Sales</h2>
          <p className="text-4xl font-bold">${totalProfit}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex-1 text-center">
          <h2 className="text-lg font-semibold mb-2">Total Stock Quantity</h2>
          <p className="text-4xl font-bold">{totalStockQuantity}</p>
        </div>
      </div>

      <p>Welcome to the dashboard! Here you can see an overview of the system.</p>
    </div>
  );
};

export default Dashboard;
