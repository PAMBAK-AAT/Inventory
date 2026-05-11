

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; 
import { FaPlus, FaCheckCircle, FaExclamationCircle, FaTrash, FaSpinner, FaSearch } from 'react-icons/fa'; // Added FaSearch

const Users = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: ""
  });

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Added state for search query
  const [tableLoading, setTableLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [notification, setNotification] = useState({ message: null, type: '' });

  // ✅ FETCH USERS
  const fetchUsers = useCallback(async () => {
    setTableLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setNotification({
        message: error.response?.data?.message || "Could not fetch users",
        type: "error",
      });
    } finally {
      setTableLoading(false);
    }
  }, []);

  // ✅ INITIAL LOAD
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ✅ AUTO CLEAR NOTIFICATION
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: null, type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // ✅ CLEAR FORM
  const handleFormClear = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      address: "",
      role: "",
    });
  };

  // ✅ DELETE USER
  const handleDeleteClick = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/users/delete/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        setNotification({
          message: "User deleted successfully!",
          type: "success",
        });
        fetchUsers(); 
      } else {
        setNotification({
          message: response.data.message || "Failed to delete user",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setNotification({
        message: err.response?.data?.message || "Failed to delete user",
        type: "error",
      });
    }
  };

  // ✅ ADD USER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setNotification({ message: null, type: '' });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/add",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
        }
      );

      if (response.data.success) {
        setNotification({
          message: "User added successfully!",
          type: "success",
        });

        handleFormClear();
        fetchUsers();
      } else {
        setNotification({
          message: response.data.message || "Action failed",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setNotification({
        message: error.response?.data?.message || "Action failed",
        type: "error",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // ✅ FILTER USERS BASED ON SEARCH QUERY
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });
    
  // --- STYLING & LAYOUT ---
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-900 to-slate-700">
      <h1 className="text-3xl font-bold text-white mb-6">Users Management</h1>

      {/* Notification */}
      {notification.message && (
        <div
          className={`mb-6 p-4 rounded-xl shadow-lg ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <span className="flex items-center gap-2">
            {notification.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
            {notification.message}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT FORM */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <FaPlus className="text-purple-600" />
              Add New User
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>

              <button
                type="submit"
                disabled={submitLoading}
                className="cursor-pointer w-full flex justify-center items-center gap-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-purple-400 transition-colors"
              >
                {submitLoading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                {submitLoading ? "Saving..." : "Add User"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT TABLE */}
        <div className="lg:col-span-3">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
            
            {/* ✅ NEW SEARCH BAR SECTION */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">User List</h2>
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Search by name, email, role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto p-4">
              {tableLoading ? (
                <div className="flex justify-center items-center h-64">
                  <FaSpinner className="animate-spin text-4xl text-purple-500" />
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 rounded-t-lg">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-600">#</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Name</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Role</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* ✅ MAPPING OVER FILTERED USERS INSTEAD OF ALL USERS */}
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10 text-gray-500">
                          {searchQuery ? "No matching users found" : "No users found"}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <tr key={user._id} className="border-t hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                          <td className="px-4 py-3 text-gray-800 font-medium">{user.name}</td>
                          <td className="px-4 py-3 text-gray-600">{user.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-sm font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleDeleteClick(user._id)}
                                className="cursor-pointer p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                title="Delete User"
                              >
                                <FaTrash />
                              </button>
                            </div>
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

