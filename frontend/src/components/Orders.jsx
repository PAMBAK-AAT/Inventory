import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Package } from 'lucide-react';

const Orders = () => {
  // 1. Fixed state: 'orders' should be an array, and we need a 'loading' state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. Fetch orders from the backend when the page loads
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } };
        // Assuming your backend route for getting orders is setup like this
        const res = await axios.get("http://localhost:3000/api/order", config);
        
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-gray-50/50">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
        <p className="text-gray-500 mt-1">View your order history and details</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <Loader2 className="animate-spin mx-auto h-8 w-8 text-blue-600" />
          </div>
        ) : orders.length === 0 ? (
          // 3. Show a nice empty state if the user has no orders yet
          <div className="p-10 text-center text-gray-500 flex flex-col items-center">
             <Package className="h-16 w-16 mb-4 text-gray-300" />
             <h3 className="text-xl font-bold text-gray-700">No orders found</h3>
             <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">S No.</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Product Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Quantity</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Total Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* 4. Map through the orders array */}
                {orders.map((ord, index) => (
                  <tr key={ord._id} className="hover:bg-gray-50 transition">
                    
                    {/* Serial Number */}
                    <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                    
                    {/* Product Name (populated from backend) */}
                    <td className="px-6 py-4 font-bold text-gray-800">
                        {ord.product?.name || "Unknown Product"}
                    </td>
                    
                    {/* Category Name (nested populate from backend) */}
                    <td className="px-6 py-4 text-gray-600">
                      <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm">
                        {ord.product?.category?.categoryName || "Uncategorized"}
                      </span>
                    </td>
                    
                    {/* Quantity */}
                    <td className="px-6 py-4 text-gray-800 font-semibold text-center">
                        {ord.quantity}
                    </td>
                    
                    {/* Total Price Calculation */}
                    <td className="px-6 py-4 text-blue-600 font-extrabold">
                      {/* Since totalPrice is not in your schema, we calculate it dynamically here! */}
                      Rs. {(ord.product?.price || 0) * ord.quantity}
                    </td>
                    
                    {/* Formatting the Date */}
                    <td className="px-6 py-4 text-right text-gray-500 text-sm">
                      {new Date(ord.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                      })}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;