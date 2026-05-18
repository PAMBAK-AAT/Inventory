

import axios from "axios";
import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Plus, Loader2, Trash2, Edit, Search, Briefcase } from "lucide-react"; // Added Briefcase icon

const Supplier = () => {
  const [addEditModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // States for Edit functionality
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // ADDED businessContext to initial state
  const [supplierData, setSupplierData] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
    businessContext: "", 
  });

  const handleChange = (e) => {
    setSupplierData({
      ...supplierData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/supplier`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      setSuppliers(response.data.suppliers);
    } catch (error) {
      console.error("Error in fetching Supplier", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("pos-token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Updated filter logic to also search by business context
  const filteredSuppliers = suppliers.filter((supplier) => {
    const query = searchQuery.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(query) ||
      supplier.email.toLowerCase().includes(query) ||
      supplier.number.toString().includes(query) ||
      supplier.address.toLowerCase().includes(query) ||
      (supplier.businessContext && supplier.businessContext.toLowerCase().includes(query))
    );
  });

  const handleEdit = (supplier) => {
    setSupplierData({
      name: supplier.name,
      email: supplier.email,
      number: supplier.number,
      address: supplier.address,
      businessContext: supplier.businessContext || "", // Load existing context
    });
    setSelectedId(supplier._id);
    setIsEdit(true);
    setEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/supplier/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        });
        fetchSuppliers();
      } catch (error) {
        console.error("Error deleting supplier", error);
        alert("Failed to delete supplier");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEdit 
        ? `${import.meta.env.VITE_API_URL}/api/supplier/edit/${selectedId}` 
        : `${import.meta.env.VITE_API_URL}/api/supplier/add`;
      
      const method = isEdit ? 'put' : 'post';

      await axios[method](url, supplierData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      setEditModal(false);
      setIsEdit(false);
      setSelectedId(null);
      setSupplierData({ name: "", email: "", number: "", address: "", businessContext: "" });
      fetchSuppliers();
    } catch (error) {
      console.error("Error saving supplier", error);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-gray-50/50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Suppliers
          </h1>
          <p className="text-gray-500 mt-1">Manage your supply chain partners.</p>
        </div>

        <button
          onClick={() => {
            setIsEdit(false);
            setSupplierData({ name: "", email: "", number: "", address: "", businessContext: "" });
            setEditModal(true);
          }}
          className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} />
          Add New Supplier
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name, context, email, or number..."
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p className="font-medium">Loading database...</p>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <User size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">No Suppliers Found</h3>
            <p className="text-gray-500">Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Supplier & Context</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Contact Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Address</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier._id} className="hover:bg-blue-50/30 transition-colors">
                    
                    {/* Supplier Name & Context Column */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
                          {supplier.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-base">{supplier.name}</div>
                          {supplier.businessContext && (
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded mt-1 inline-flex">
                              <Briefcase size={12} />
                              {supplier.businessContext}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact Info Column */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5 text-sm text-gray-600 font-medium">
                        <div className="flex items-center gap-2"><Mail size={14} className="text-gray-400" />{supplier.email}</div>
                        <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" />{supplier.number}</div>
                      </div>
                    </td>

                    {/* Address Column */}
                    <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                      <div className="flex items-start gap-2 max-w-xs">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                        <span className="line-clamp-2">{supplier.address}</span>
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(supplier)}
                          className="cursor-pointer p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                          title="Edit Supplier"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(supplier._id)}
                          className="cursor-pointer p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200"
                          title="Delete Supplier"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {addEditModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900">
                {isEdit ? "Edit Supplier Details" : "Add New Supplier"}
              </h2>
              <button onClick={() => setEditModal(false)} className="cursor-pointer p-2 bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors">
                <Trash2 size={16} className="opacity-0 hidden" /> {/* spacer */}
                &times;
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-bold text-gray-700">Company / Supplier Name</label>
                  <input
                    type="text"
                    name="name"
                    value={supplierData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-800 font-medium"
                  />
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-sm font-bold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={supplierData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-800 font-medium"
                  />
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-sm font-bold text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="number"
                    value={supplierData.number}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-800 font-medium"
                  />
                </div>
              </div>

              {/* NEW FIELD: Business Context */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  Real-World Context <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded">e.g., Electronics Wholesaler, Fast Shipping</span>
                </label>
                <input
                  type="text"
                  name="businessContext"
                  value={supplierData.businessContext}
                  onChange={handleChange}
                  placeholder="What is their primary business role?"
                  className="w-full px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-xl outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all text-purple-900 font-medium placeholder-purple-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Physical Address</label>
                <textarea
                  name="address"
                  rows="2"
                  value={supplierData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-800 font-medium"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="cursor-pointer flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  {isEdit ? "Update Supplier" : "Save Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier;