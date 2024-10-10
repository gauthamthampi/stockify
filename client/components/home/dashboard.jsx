import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { localhost } from '@/url';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // States for the statistics
  const [inventoryCount, setInventoryCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalStockQuantity, setTotalStockQuantity] = useState(0);
  const [monthlySales, setMonthlySales] = useState([]); // State for monthly sales data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('tokenStockify');
        const response = await axios.post(localhost + '/api/dashboard/fetchDashboardData', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const { totalItemsSold, totalCustomers, totalProfit, totalInventoryItems, monthlySales } = response.data;
        console.log(response.data);
        
        setInventoryCount(totalInventoryItems);
        setCustomerCount(totalCustomers);
        setTotalProfit(totalProfit);
        setTotalStockQuantity(totalItemsSold);
        setMonthlySales(monthlySales); // Set monthly sales data
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Chart data and options for the line graph
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // X-axis labels for each month
    datasets: [
      {
        label: 'Monthly Sales ($)',
        data: monthlySales, // Sales data for each month
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Sales Data',
      },
    },
  };

  return (
    <div className="bg-black text-white h-screen p-6">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className='font-thin mb-4'>Welcome to the dashboard! Here you can see an overview of the system.</p>

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

      {/* Line chart for monthly sales */}
      {/* <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <Line data={chartData} options={chartOptions} />
      </div> */}

    </div>
  );
};

export default Dashboard;
