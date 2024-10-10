import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Import axios
import { localhost } from '@/url';

const Sidebar = ({ activeComponent }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', key: 'dashboard' },
    { name: 'Inventory Management', path: '/inventory', key: 'inventory' },
    { name: 'Customers', path: '/customers', key: 'customers' },
    { name: 'Sales', path: '/sales', key: 'sales' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("tokenStockify");
      if (!token) {
        router.push("/login");
        return; 
      }

      try {
        const response = await axios.post(`${localhost}/api/fetchUserDetails`, null, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data) {
          setUser(response.data); 
        }
      } catch (error) {
        console.error(error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("tokenStockify");
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="flex flex-col justify-between h-full p-4 bg-black text-white">
      <div>
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src="https://img.freepik.com/premium-vector/black-white-image-woman-with-white-hair_1240970-21548.jpg?ga=GA1.1.514809842.1728299280&semt=ais_hybrid"
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <p className="text-xs text-gray-500">Joined: {user?.createdAt?.slice(0, 10)}</p>
          </div>
        </div>

        <hr className="border-gray-600 mb-4" />

        <ul>
          {menuItems.map((item) => (
            <li key={item.key}>
              <Link
                href={item.path}
                className={`block py-2 px-4 rounded-md ${
                  activeComponent === item.key
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleLogout} className="w-full py-2 px-4 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
