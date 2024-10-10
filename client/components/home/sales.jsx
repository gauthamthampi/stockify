import { useEffect, useState } from 'react';
import axios from 'axios';
import { localhost } from '@/url';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSales();
    fetchItemsAndCustomers();
  }, []);

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("tokenStockify");
      const response = await axios.post(localhost + '/api/fetchSales', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const fetchItemsAndCustomers = async () => {
    try {
      const token = localStorage.getItem("tokenStockify");
      const [itemsResponse, customersResponse] = await Promise.all([
        axios.post(`${localhost}/api/inventory/fetchItems`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.post(`${localhost}/api/customers/fetchCustomers`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ]);

      setItems(itemsResponse.data);
      setCustomers(customersResponse.data);
    } catch (error) {
      console.error('Error fetching items and customers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedInventoryItem = items.find((item) => item.name === selectedItem);

    if (quantity > selectedInventoryItem.quandity) {
      setError('Quantity exceeds available stock.');
      return;
    }
    try {
      const token = localStorage.getItem("tokenStockify");
      await axios.post(localhost + '/api/recordSales', {
        itemName: selectedItem,
        customerName: selectedCustomer,
        quantity,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSales();
      setModalOpen(false);
      setSelectedItem('');
      setSelectedCustomer('');
      setQuantity(1);
      setError('');
    } catch (error) {
      console.error('Error recording sale:', error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Sales Data', 14, 16);
    doc.autoTable({
      head: [['Item', 'Customer', 'Quantity', 'Cash', 'Sale Date']],
      body: sales.map(sale => [
        sale.itemName, 
        sale.customerName, 
        sale.quantity, 
        `₹${sale.cash}`, 
        new Date(sale.saleDate).toLocaleDateString()
      ]),
    });
    doc.save('sales_data.pdf');
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      sales.map(sale => ({
        Item: sale.itemName,
        Customer: sale.customerName,
        Quantity: sale.quantity,
        Cash: `₹${sale.cash}`,
        'Sale Date': new Date(sale.saleDate).toLocaleDateString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales');
    XLSX.writeFile(workbook, 'sales_data.xlsx');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-white">Sales</h1>
        <div className="space-x-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={() => setModalOpen(true)}
          >
            Record Sale
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded-md"
            onClick={downloadExcel}
          >
            Download Excel
          </button>
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold tracking-wide uppercase border-b border-gray-200 dark:border-gray-700">Item</th>
            <th className="px-6 py-3 text-left text-sm font-semibold tracking-wide uppercase border-b border-gray-200 dark:border-gray-700">Customer</th>
            <th className="px-6 py-3 text-left text-sm font-semibold tracking-wide uppercase border-b border-gray-200 dark:border-gray-700">Quantity</th>
            <th className="px-6 py-3 text-left text-sm font-semibold tracking-wide uppercase border-b border-gray-200 dark:border-gray-700">Cash</th>
            <th className="px-6 py-3 text-left text-sm font-semibold tracking-wide uppercase border-b border-gray-200 dark:border-gray-700">Sale Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {sales.map((sale, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition ease-in-out">
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 dark:border-gray-700">{sale.itemName}</td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 dark:border-gray-700">{sale.customerName}</td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 dark:border-gray-700">{sale.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 dark:border-gray-700">₹{sale.cash}</td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 dark:border-gray-700">{new Date(sale.saleDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-md w-96">
            <h2 className="text-lg font-bold text-white mb-4">Record Sale</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Item</label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="p-2 w-full border rounded-md bg-gray-700 text-white border-gray-600"
                  required
                >
                  <option value="">Select Item</option>
                  {items.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name} (Stock: {item.quandity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Customer</label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="p-2 w-full border rounded-md bg-gray-700 text-white border-gray-600"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer, index) => (
                    <option key={index} value={customer.name}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
  <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
  <input
    type="number"
    min={1}
    value={quantity === 0 ? '' : quantity} 
    onChange={(e) => {
      const value = e.target.value;
      if (value === '') {
        setQuantity(0); 
      } else {
        setQuantity(Math.max(1, Number(value))); // Ensure minimum value of 1
      }
    }}
    className="p-2 w-full border rounded-md bg-gray-700 text-white border-gray-600"
    required
  />
  {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 mr-2 border border-gray-500 rounded-md text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Record Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
