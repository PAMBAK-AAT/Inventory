




import axios from "axios";
import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Plus, Loader2, Trash2, Edit, Search } from "lucide-react";

const Supplier = () => {
  const [addEditModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // States for Edit functionality
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [supplierData, setSupplierData] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
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
        "http://localhost:3000/api/supplier",
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

  // Filter logic for Search functionality
  const filteredSuppliers = suppliers.filter((supplier) => {
    const query = searchQuery.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(query) ||
      supplier.email.toLowerCase().includes(query) ||
      supplier.number.toString().includes(query) ||
      supplier.address.toLowerCase().includes(query)
    );
  });

  const handleEdit = (supplier) => {
    setSupplierData({
      name: supplier.name,
      email: supplier.email,
      number: supplier.number,
      address: supplier.address,
    });
    setSelectedId(supplier._id);
    setIsEdit(true);
    setEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await axios.delete(`http://localhost:3000/api/supplier/delete/${id}`, {
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
        ? `http://localhost:3000/api/supplier/edit/${selectedId}` 
        : "http://localhost:3000/api/supplier/add";
      
      const method = isEdit ? 'put' : 'post';

      await axios[method](url, supplierData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      setEditModal(false);
      setIsEdit(false);
      setSelectedId(null);
      setSupplierData({ name: "", email: "", number: "", address: "" });
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
            setSupplierData({ name: "", email: "", number: "", address: "" });
            setEditModal(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
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
          placeholder="Search by name, email, or number..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out"
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
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Supplier</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Address</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {supplier.name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-800">{supplier.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2"><Mail size={14} />{supplier.email}</div>
                        <div className="flex items-center gap-2"><Phone size={14} />{supplier.number}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">
                      <div className="flex items-start gap-2 max-w-xs">
                        <MapPin size={14} className="mt-1 shrink-0" />
                        <span className="line-clamp-2">{supplier.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(supplier)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(supplier._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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

      {addEditModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEdit ? "Edit Supplier" : "Add Supplier"}
              </h2>
              <button onClick={() => setEditModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={supplierData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={supplierData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="number"
                  value={supplierData.number}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Address</label>
                <textarea
                  name="address"
                  rows="3"
                  value={supplierData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none resize-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-shadow shadow-lg"
                >
                  {isEdit ? "Update Details" : "Save Partner"}
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