import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { localhost } from '@/url';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [inputErrors, setInputErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("tokenStockify");
      const response = await axios.post(`${localhost}/api/customers/fetchCustomers`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleAddOrUpdateCustomer = async (e) => {
    e.preventDefault();
    setInputErrors({});
    setBackendError('');

    // Validation
    if (!customerName) {
      setInputErrors((prev) => ({ ...prev, customerName: 'Customer Name is required.' }));
    }
    if (!email) {
      setInputErrors((prev) => ({ ...prev, email: 'Email is required.' }));
    }
    if (!phone) {
      setInputErrors((prev) => ({ ...prev, phone: 'Phone number is required.' }));
    }
    if (!address) {
      setInputErrors((prev) => ({ ...prev, address: 'Address is required.' }));
    }

    if (Object.keys(inputErrors).length > 0) {
      return;
    }

    const newCustomer = { name: customerName, email, phone, address };
    const token = localStorage.getItem("tokenStockify");

    try {
      if (editMode) {
        await axios.put(
          `${localhost}/api/customers/updateCustomer/${editCustomerId}`,
          newCustomer,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Add new customer
        await axios.post(
          `${localhost}/api/customers/addCustomer`,
          newCustomer,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      fetchCustomers();
      resetForm();
      setModalOpen(false);
    } catch (error) {
      setBackendError(error.response?.data?.message || 'Error adding/updating customer');
      console.error('Error adding/updating customer:', error);
    }
  };

  const handleEditCustomer = (customer) => {
    setEditMode(true);
    setEditCustomerId(customer._id);
    setCustomerName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone);
    setAddress(customer.address);
    setModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setCustomerToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteCustomer = async (id) => {
    const token = localStorage.getItem("tokenStockify");
    try {
      await axios.delete(`${localhost}/api/customers/deleteCustomer/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCustomers();
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const resetForm = () => {
    setCustomerName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setInputErrors({});
    setBackendError('');
    setEditMode(false);
    setEditCustomerId(null);
  };

  return (
    <div className="bg-black text-white h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => {
            setModalOpen(true);
            resetForm();
          }}
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          Add New Customer
        </button>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete this customer?</p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="inline-flex justify-center rounded-md border bg-white dark:bg-gray-700 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCustomer(customerToDelete)}
                  className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">{editMode ? 'Edit Customer' : 'Add New Customer'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="p-4" onSubmit={handleAddOrUpdateCustomer}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`mt-1 p-2 block w-full rounded-md border ${inputErrors.customerName ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 shadow-sm 
                    focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
                    text-sm`}
                    required
                  />
                  {inputErrors.customerName && <p className="text-red-500 text-sm">{inputErrors.customerName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`mt-1 p-2 block w-full rounded-md border ${inputErrors.email ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 shadow-sm 
                    focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
                    text-sm`}
                    required
                  />
                  {inputErrors.email && <p className="text-red-500 text-sm">{inputErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`mt-1 p-2 block w-full rounded-md border ${inputErrors.phone ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 shadow-sm 
                    focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
                    text-sm`}
                    required
                  />
                  {inputErrors.phone && <p className="text-red-500 text-sm">{inputErrors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`mt-1 p-2 block w-full rounded-md border ${inputErrors.address ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 shadow-sm 
                    focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
                    text-sm`}
                    required
                  />
                  {inputErrors.address && <p className="text-red-500 text-sm">{inputErrors.address}</p>}
                </div>

                {backendError && <p className="text-red-500 text-sm">{backendError}</p>}

                <button
                  type="submit"
                  className="mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  {editMode ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
  <thead className="bg-gray-50 dark:bg-gray-800">
    <tr>
      <th className="px-6 py-3 text-center text-sm font-semibold tracking-wide uppercase border-b border-gray-200 dark:border-gray-700">Customer Name</th>
      <th className="px-6 py-3 text-center text-sm font-semibold tracking-wide uppercase border-b border-gray-200 dark:border-gray-700">Email</th>
      <th className="px-6 py-3 text-center text-sm font-semibold tracking-wide uppercase border-b border-gray-200 dark:border-gray-700">Phone</th>
      <th className="px-6 py-3 text-center text-sm font-semibold tracking-wide uppercase border-b border-gray-200 dark:border-gray-700">Address</th>
      <th className="px-6 py-3 text-center text-sm font-semibold tracking-wide uppercase border-b border-gray-200 dark:border-gray-700">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
    {customers.length > 0 ? (
      customers.map((customer) => (
        <tr key={customer._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition ease-in-out">
          <td className="px-6 py-4 text-center">{customer.name}</td>
          <td className="px-6 py-4 text-center">{customer.email}</td>
          <td className="px-6 py-4 text-center">{customer.phone}</td>
          <td className="px-6 py-4 whitespace-normal break-words text-center">
            {customer.address.length > 50 ? customer.address.slice(0, 50) + '\n' + customer.address.slice(50) : customer.address}
          </td>
          <td className="px-6 py-4 text-center">
            <button onClick={() => handleEditCustomer(customer)} className="text-blue-500 hover:text-blue-700 mr-4">Edit</button>
            <button onClick={() => openDeleteModal(customer._id)} className="text-red-500 hover:text-red-700">Delete</button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No customers found.</td>
      </tr>
    )}
  </tbody>
</table>

      </div>
    </div>
  );
};

export default Customers;
