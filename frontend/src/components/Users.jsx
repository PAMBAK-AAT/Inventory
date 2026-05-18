import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; 
import { 
  Search, 
  Trash2, 
  Loader2, 
  User as UserIcon, 
  Mail, 
  MapPin, 
  ShoppingBag, 
  DollarSign, 
  X,
  Shield,
  UserCheck
} from 'lucide-react'; 

const Users = () => {
  /* // ==========================================
  // ADD USER STATE & FUNCTIONS (COMMENTED OUT)
  // ==========================================
  const [formData, setFormData] = useState({ name: "", email: "", password: "", address: "", role: "" });
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleFormClear = () => { setFormData({ name: "", email: "", password: "", address: "", role: "" }); };

  const handleSubmit = async (e) => { ... } 
  */

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [tableLoading, setTableLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [notification, setNotification] = useState({ message: null, type: '' });

  // FETCH USERS & ALL ORDERS (to compute stats)
  const fetchData = useCallback(async () => {
    setTableLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } };
      
      const [usersRes, ordersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/users`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/api/order`, config) 
      ]);

      if (usersRes.data.success) {
        setUsers(usersRes.data.users);
      }
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setNotification({ message: "Could not fetch system data", type: "error" });
    } finally {
      setTableLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => { setNotification({ message: null, type: '' }); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // DELETE USER
  const handleDeleteClick = async (e, userId) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } };
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/delete/${userId}`, config);

      if (response.data.success) {
        setNotification({ message: "User deleted successfully!", type: "success" });
        if(selectedUser?._id === userId) setSelectedUser(null); 
        fetchData(); 
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setNotification({ message: err.response?.data?.message || "Failed to delete user", type: "error" });
    }
  };

  // FILTER USERS
  const filteredUsers = users.filter((u) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower) ||
      u.role.toLowerCase().includes(searchLower)
    );
  });

  // COMPUTE SELECTED USER STATS
  const getUserStats = () => {
    if (!selectedUser) return { totalOrders: 0, revenue: 0 };
    
    const userOrders = orders.filter(o => o.customer?._id === selectedUser._id);
    const revenue = userOrders.reduce((sum, ord) => sum + (ord.totalPrice || ((ord.product?.price || 0) * ord.quantity)), 0);
    
    return { totalOrders: userOrders.length, revenue };
  };

  const selectedStats = getUserStats();

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-gray-50/50">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">User Management</h1>
        <p className="text-gray-500 mt-1">Select a user from the list to view their complete details and analytics.</p>
      </div>

      {/* Notification */}
      {notification.message && (
        <div className={`mb-6 p-4 rounded-xl shadow-sm border ${notification.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          <span className="font-bold">{notification.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ========================================== */}
        {/* LEFT COLUMN: USER DETAILS INSPECTION PANEL   */}
        {/* ========================================== */}
        <div className="lg:col-span-1">
          {selectedUser ? (
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden sticky top-6 animate-in slide-in-from-left-4 duration-300">
              
              {/* Profile Header Background */}
              <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 pb-6 relative">
                
                {/* --- FIXED AVATAR SECTION --- */}
                {/* Increased size to w-24 h-24, adjusted -top-12 so it perfectly half-overlaps the blue header */}
                <div className="w-24 h-24 bg-white rounded-full p-1.5 shadow-lg absolute -top-12 left-6">
                  <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <UserIcon size={40} />
                  </div>
                </div>

                {/* Used pt-16 to securely push the name DOWN so it never overlaps the avatar */}
                <div className="pt-16 mb-6">
                  <h2 className="text-2xl font-extrabold text-gray-900">{selectedUser.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {selectedUser.role === 'admin' ? <Shield size={12}/> : <UserCheck size={12}/>}
                      {selectedUser.role.toUpperCase()}
                    </span>
                  </div>
                </div>
                {/* ---------------------------- */}

                {/* Contact Info */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Mail className="text-gray-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                      <p className="text-sm font-semibold text-gray-800 break-all">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Physical Address</p>
                      <p className="text-sm font-semibold text-gray-800">{selectedUser.address || "No address provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Analytics Grid */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <ShoppingBag className="text-blue-500 mb-2" size={20} />
                    <p className="text-2xl font-black text-gray-800">{selectedStats.totalOrders}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Total Orders</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                    <DollarSign className="text-green-600 mb-2" size={20} />
                    <p className="text-2xl font-black text-green-700">Rs. {selectedStats.revenue.toLocaleString()}</p>
                    <p className="text-xs font-bold text-green-600/70 uppercase tracking-wider mt-1">Total Spent</p>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 border-dashed p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <div className="w-16 h-16 bg-blue-50 text-blue-300 rounded-full flex items-center justify-center mb-4">
                <UserIcon size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-700">No User Selected</h3>
              <p className="text-sm text-gray-400 mt-2">Click on any user in the table to view their complete profile, address, and order statistics.</p>
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN: USER LIST TABLE              */}
        {/* ========================================== */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            
            {/* Search Bar */}
            <div className="p-5 border-b border-gray-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-extrabold text-gray-800">Directory</h2>
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-semibold text-gray-700"
                />
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {tableLoading ? (
                <div className="flex flex-col justify-center items-center h-80">
                  <Loader2 className="animate-spin text-4xl text-blue-600 mb-4" />
                  <p className="text-gray-500 font-medium">Loading user database...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-16 text-gray-500 font-medium">
                          {searchQuery ? "No matching users found." : "No users found in the database."}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr 
                          key={u._id} 
                          onClick={() => setSelectedUser(u)}
                          className={`cursor-pointer transition-colors duration-150 ${selectedUser?._id === u._id ? 'bg-blue-50/60' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{u.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{u.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => handleDeleteClick(e, u._id)}
                              className="p-2 text-red-400 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}

export default Users;