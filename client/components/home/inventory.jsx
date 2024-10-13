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
  const [editMode, setEditMode] = useState(false); // New state for edit mode
  const [editItemId, setEditItemId] = useState(null); // Store the id of the item being edited
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("tokenStockify");
      const response = await axios.post(`${localhost}/api/inventory/fetchItems`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data);
                         
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleAddOrUpdateItem = async (e) => {
    e.preventDefault();
    setInputErrors({});
    setBackendError('');

    if (!itemName) {
      setInputErrors((prev) => ({ ...prev, itemName: 'Item Name is required.' }));
    }
    if (!description) {
      setInputErrors((prev) => ({ ...prev, description: 'Description is required.' }));
    }
    if (quantity <= 0) {
      setInputErrors((prev) => ({ ...prev, quantity: 'Quantity must be greater than zero.' }));
    }
    if (price < 0) {
      setInputErrors((prev) => ({ ...prev, price: 'Price must be a positive number.' }));
    }

    if (Object.keys(inputErrors).length > 0) {
      return;
    }

    const newItem = { name: itemName, description, quandity:quantity, price };
    const token = localStorage.getItem("tokenStockify");

    try {
      if (editMode) {
        // Update existing item
        await axios.put(
          `${localhost}/api/inventory/updateItem/${editItemId}`,
          newItem,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Add new item
        await axios.put(
          `${localhost}/api/inventory/addItems`,
          newItem,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      fetchItems(); 
      resetForm();
      setModalOpen(false);
    } catch (error) {
      setBackendError(error.response?.data?.message || 'Error adding/updating item');
      console.error('Error adding/updating item:', error);
    }
  };

  const handleEditItem = (item) => {
    setEditMode(true);
    setEditItemId(item._id);
    setItemName(item.name);
    setDescription(item.description);
    setQuantity(item.quandity);
    setPrice(item.price);
    setModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery)
  );
  

  const handleDeleteItem = async (id) => {
    const token = localStorage.getItem("tokenStockify");
    try {
      await axios.delete(`${localhost}/api/inventory/deleteItem/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchItems();
      setDeleteModalOpen(false); 
      setItemToDelete(null); 
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  

  const resetForm = () => {
    setItemName('');
    setDescription('');
    setQuantity(0);
    setPrice(0);
    setInputErrors({});
    setBackendError('');
    setEditMode(false); 
    setEditItemId(null); 
  };

  return (
    <div className="bg-black text-white h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <input
            type="text"
            className="border border-gray-600 bg-gray-800 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by name or description"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button onClick={handleOpenModal} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add New</button>
        </div>

      {isDeleteModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this item?</p>
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
            onClick={() => handleDeleteItem(itemToDelete)}
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
              <h2 className="text-xl font-semibold">{editMode ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="p-4" onSubmit={handleAddOrUpdateItem}>
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
                  className="inline-flex justify-center rounded-md border bg-white dark:bg-gray-700 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-white"
                >
                  {editMode ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-center text-sm font-semibold tracking-wide uppercase border-b border-gray-200 dark:border-gray-700">Name</th>
              <th className="px-6 py-3 text-start text-sm font-semibold tracking-wide uppercase border-b border-gray-200 dark:border-gray-700">Description</th>
              <th className="px-6 py-3 text-center text-sm font-semibold tracking-wide uppercase border-b border-gray-200 dark:border-gray-700">Quantity</th>
              <th className="px-6 py-3 text-center text-sm font-semibold tracking-wide uppercase border-b border-gray-200 dark:border-gray-700">Price</th>
              <th className="px-6 py-3 text-center text-sm font-semibold tracking-wide uppercase border-b border-gray-200 dark:border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition ease-in-out">
                  <td className="px-6 py-4 text-center">{item.name}</td>
                  <td className="px-6 py-4 text-start">
                    {item.description.length > 50 ? (
                      <>
                        {item.description.slice(0, 50)}<br />
                        {item.description.slice(50)}
                      </>
                    ) : (
                      item.description
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">{item.quandity}</td>
                  <td className="px-6 py-4 text-center">₹{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
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
