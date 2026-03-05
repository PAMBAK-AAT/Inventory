import axios from "axios";
import React, { useState, useEffect } from "react";

const Supplier = () => {
  const [addEditModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [suppliers, setSuppliers] = useState([]);

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

  // 🔥 Fetch Suppliers
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/suppliers",
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

  // 🔥 Submit Supplier
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3000/api/supplier/add",
        supplierData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      // Reset form
      setSupplierData({
        name: "",
        email: "",
        number: "",
        address: "",
      });

      setEditModal(false);
      fetchSuppliers();
    } catch (error) {
      console.error("Error adding supplier", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("pos-token");
        window.location.href = "/login";
      }
    }
  };

  return (
    <div className="w-full h-full p-6 flex flex-col gap-6 bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Supplier Management
        </h1>

        <button
          onClick={() => setEditModal(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow"
        >
          + Add Supplier
        </button>
      </div>

      {/* Supplier List */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : suppliers.length === 0 ? (
          <p className="text-gray-400">No suppliers added yet</p>
        ) : (
          <div className="grid gap-4">
            {suppliers.map((supplier) => (
              <div
                key={supplier._id}
                className="p-4 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">
                    {supplier.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {supplier.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {supplier.number}
                  </p>
                  <p className="text-sm text-gray-500">
                    {supplier.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Now here show the suppliers */}
      {/* Supplier List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-500 text-lg">Loading suppliers...</p>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-400 text-lg">
              No suppliers added yet
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <div
                key={supplier._id}
                className="bg-gray-50 border rounded-xl p-5 shadow-sm hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {supplier.name}
                </h3>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {supplier.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {supplier.number}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {supplier.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {addEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-5 text-gray-800">
              Add Supplier
            </h2>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Supplier Name"
                value={supplierData.name}
                onChange={handleChange}
                required
                className="px-4 py-2 border rounded-lg"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={supplierData.email}
                onChange={handleChange}
                required
                className="px-4 py-2 border rounded-lg"
              />

              <input
                type="tel"
                name="number"
                placeholder="Phone Number"
                value={supplierData.number}
                onChange={handleChange}
                required
                className="px-4 py-2 border rounded-lg"
              />

              <textarea
                name="address"
                placeholder="Address"
                rows="3"
                value={supplierData.address}
                onChange={handleChange}
                required
                className="px-4 py-2 border rounded-lg resize-none"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save Supplier
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