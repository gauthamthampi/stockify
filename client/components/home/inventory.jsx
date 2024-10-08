import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { localhost } from '@/url';

const Inventory = () => {
  const [items, setItems] = useState([]); 
  const [isModalOpen, setModalOpen] = useState(false); 
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(1);
  const [inputErrors, setInputErrors] = useState({}); 
  const [backendError, setBackendError] = useState(''); 
//   const token = localStorage.getItem("tokenStockify")
//   console.log(token+"token");
  
  useEffect(() => {
    fetchItems(); 
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("tokenStockify")
      console.log(token);
      
      const response = await axios.post(localhost+'/api/inventory/fetchItems',
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
      setItems(response.data); 
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setInputErrors({});
    setBackendError(''); 

    if (!itemName) {
      setInputErrors(prev => ({ ...prev, itemName: 'Item Name is required.' }));
    }
    if (!description) {
      setInputErrors(prev => ({ ...prev, description: 'Description is required.' }));
    }
    if (quantity <= 0) {
      setInputErrors(prev => ({ ...prev, quantity: 'Quantity must be greater than zero.' }));
    }
    if (price < 0) {
      setInputErrors(prev => ({ ...prev, price: 'Price must be a positive number.' }));
    }

    if (Object.keys(inputErrors).length > 0) {
      return;
    }

    const newItem = { name: itemName, description, quantity, price };
    const token = localStorage.getItem("tokenStockify")
    try {
        const response = await axios.put(
            localhost+'/api/inventory/addItems',
            newItem,
            {
              headers: {
                Authorization: `Bearer ${token}` 
              }
            }
          );
          console.log('Item added successfully:', response.data);
      fetchItems(); 
      resetForm(); 
      setModalOpen(false); 
    } catch (error) {
      setBackendError(error.response?.data?.message || 'Error adding new item'); 
      console.error('Error adding new item:', error);
    }
  };

  const resetForm = () => {
    setItemName('');
    setDescription('');
    setQuantity(0);
    setPrice(0);
    setInputErrors({}); 
    setBackendError(''); 
  };

  return (
    <div className="bg-black text-white h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <p>Welcome to the Inventory! Here you can see an overview of the system.</p>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          Add New Item
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Item</h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="p-4" onSubmit={handleAddItem}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Item Name
                  </label>
                  <input
                    type="text"
                    id="itemName"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className={`mt-1 p-2 block w-full rounded-md border ${inputErrors.itemName ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 shadow-sm 
                             focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
                             text-sm`}
                    required
                  />
                  {inputErrors.itemName && <p className="text-red-500 text-sm">{inputErrors.itemName}</p>}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`mt-1 p-2 block w-full rounded-md border ${inputErrors.description ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 shadow-sm 
                             focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
                             text-sm`}
                    required
                  />
                  {inputErrors.description && <p className="text-red-500 text-sm">{inputErrors.description}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                <div>
  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Quantity
  </label>
  <input
    type="number"
    id="quantity"
    min={1}
    value={quantity || ''} 
    onChange={(e) => {
      const value = e.target.value;
      setQuantity(value === '' ? '' : Number(value));
    }}
    className={`mt-1 p-2 block w-full rounded-md border ${inputErrors.quantity ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 shadow-sm 
             focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
             text-sm`}
    required
  />
  {inputErrors.quantity && <p className="text-red-500 text-sm">{inputErrors.quantity}</p>}
</div>

<div>
  <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Price
  </label>
  <input
    type="number"
    id="price"
    min={1}
    value={price || ''} 
    onChange={(e) => {
      const value = e.target.value;
      setPrice(value === '' ? '' : Number(value));
    }}
    className={`mt-1 p-2 block w-full rounded-md border ${inputErrors.price ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 shadow-sm 
             focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
             text-sm`}
    required
  />
  {inputErrors.price && <p className="text-red-500 text-sm">{inputErrors.price}</p>}
</div>

                </div>
              </div>
              
              {backendError && <p className="text-red-500 text-sm mt-2">{backendError}</p>}
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                           shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2
                           focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2
                           text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2
                           focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
  <thead className="bg-gray-50 dark:bg-gray-800">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
    </tr>
  </thead>
  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
    {items.length > 0 ? (
      items.map(item => (
        <tr key={item.id}>
          <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
          <td className="px-6 py-4 whitespace-nowrap">{item.description}</td>
          <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
          <td className="px-6 py-4 whitespace-nowrap">${item.price.toFixed(2)}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
          No items available in the inventory
        </td>
      </tr>
    )}
  </tbody>
</table>

      </div>
    </div>
  );
};

export default Inventory;
