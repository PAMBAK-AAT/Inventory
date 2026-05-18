

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Loader2, Package, Trash2, ChevronDown, ChevronRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const { user } = useAuth();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } };
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order`, config);
      
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Delete Order
  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
        return;
    }

    try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } };
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/order/delete/${orderId}`, config);
        
        if (res.data.success) {
            setOrders(orders.filter(order => order._id !== orderId));
            alert("Order deleted successfully!");
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        alert(error.response?.data?.message || "Failed to delete order.");
    }
  };

  // Group orders by customer (Used for Admin View)
  const groupedOrders = useMemo(() => {
    const groups = orders.reduce((acc, order) => {
      const customerId = order.customer?._id || 'unknown';
      if (!acc[customerId]) {
        acc[customerId] = {
          customer: order.customer,
          totalOrders: 0,
          totalSpent: 0,
          orders: []
        };
      }
      acc[customerId].orders.push(order);
      acc[customerId].totalOrders += 1;
      acc[customerId].totalSpent += (order.totalPrice || ((order.product?.price || 0) * order.quantity));
      return acc;
    }, {});
    
    return Object.values(groups);
  }, [orders]);

  const toggleGroup = (customerId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [customerId]: !prev[customerId]
    }));
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-gray-50/50">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
            {user?.role === 'admin' ? 'All System Orders' : 'My Orders'}
        </h1>
        <p className="text-gray-500 mt-1">
            {user?.role === 'admin' ? 'Manage and track customer orders across the system' : 'View your order history and details'}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center flex flex-col justify-center items-center">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600 mb-4" />
            <p className="text-gray-500 font-medium">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-gray-500 flex flex-col items-center">
             <Package className="h-20 w-20 mb-4 text-gray-300" />
             <h3 className="text-xl font-bold text-gray-700">No orders found</h3>
             <p className="mt-2">There are currently no orders to display.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            
            {/* ========================================= */}
            {/* ADMIN VIEW: Grouped by Customer Accordion */}
            {/* ========================================= */}
            {user?.role === 'admin' ? (
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 w-10"></th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Total Orders</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {groupedOrders.map((group) => {
                    const custId = group.customer?._id || 'unknown';
                    const isExpanded = expandedGroups[custId];

                    return (
                      <React.Fragment key={custId}>
                        {/* Parent Row (Customer Summary) */}
                        <tr 
                          onClick={() => toggleGroup(custId)}
                          className={`cursor-pointer transition-colors duration-150 ${isExpanded ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-6 py-4 text-gray-400">
                            {isExpanded ? <ChevronDown size={20} className="text-blue-600" /> : <ChevronRight size={20} />}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 rounded-full text-gray-500">
                                <User size={18} />
                              </div>
                              <div>
                                <div className="font-bold text-gray-800">{group.customer?.name || "Unknown User"}</div>
                                <div className="text-xs text-gray-500">{group.customer?.email || "No email"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                              {group.totalOrders} Orders
                            </span>
                          </td>
                          <td className="px-6 py-4 font-black text-gray-800">
                            Rs. {group.totalSpent.toLocaleString()}
                          </td>
                        </tr>

                        {/* Child Row (Order Details Table) */}
                        {isExpanded && (
                          <tr>
                            <td colSpan="4" className="p-0 bg-gray-50/50 border-b border-gray-100">
                              <div className="px-10 py-6">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Order History</h4>
                                <table className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                  <thead className="bg-gray-100 border-b border-gray-200 text-xs text-gray-600 uppercase font-semibold">
                                    <tr>
                                      <th className="px-4 py-3">Product Name</th>
                                      <th className="px-4 py-3">Category</th>
                                      <th className="px-4 py-3 text-center">Qty</th>
                                      <th className="px-4 py-3">Price</th>
                                      <th className="px-4 py-3">Date & Time</th>
                                      <th className="px-4 py-3 text-center">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {group.orders.map((ord) => (
                                      <tr key={ord._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold text-gray-800">{ord.product?.name || "Product Deleted"}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{ord.product?.category?.categoryName || "Uncategorized"}</td>
                                        <td className="px-4 py-3 text-center font-bold text-gray-700">{ord.quantity}</td>
                                        <td className="px-4 py-3 font-bold text-blue-600">
                                            Rs. {ord.totalPrice || ((ord.product?.price || 0) * ord.quantity)}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500 font-medium">
                                          {new Date(ord.orderDate).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <button 
                                              onClick={(e) => { e.stopPropagation(); handleDelete(ord._id); }}
                                              className="p-1.5 text-red-500 hover:bg-red-100 hover:text-red-700 rounded transition-colors"
                                              title="Delete Order"
                                          >
                                              <Trash2 size={16} />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              
              /* ========================================= */
              /* CUSTOMER VIEW: Standard Flat Table        */
              /* ========================================= */
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">S No.</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Qty</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((ord, index) => (
                    <tr key={ord._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-gray-500 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{ord.product?.name || "Product Deleted"}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-semibold">
                          {ord.product?.category?.categoryName || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-bold text-center">{ord.quantity}</td>
                      <td className="px-6 py-4 text-blue-600 font-black">
                        Rs. {ord.totalPrice || ((ord.product?.price || 0) * ord.quantity)}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm font-medium">
                        {new Date(ord.orderDate).toLocaleString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;