import axios from "axios";
import React, { useState, useEffect } from "react";
import { Package, Plus, Search, Edit, Trash2, Loader2, User } from "lucide-react";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    supplier: "",
    price: "",
    stock: "",
    description: ""
  });

  const fetchInitialData = async () => {
  setLoading(true);
  try {
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } };
    
    // Fetching all data
    const [prodRes, catRes, suppRes] = await Promise.all([
      axios.get("http://localhost:3000/api/product", config),
      axios.get("http://localhost:3000/api/category", config),
      axios.get("http://localhost:3000/api/supplier", config)
    ]);

    // Added console logs to help you debug what the server is actually sending
    console.log("Categories from server:", catRes.data);
    console.log("Suppliers from server:", suppRes.data);

    // Ensure we are setting arrays even if the data is missing
    setProducts(prodRes.data.products || []);
    setCategories(catRes.data.categories || []);
    setSuppliers(suppRes.data.suppliers || []);

  } catch (error) {
    console.error("Fetch error", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchInitialData(); }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } };
    try {
      const method = isEdit ? 'put' : 'post';
      const url = isEdit 
        ? `http://localhost:3000/api/product/edit/${selectedId}` 
        : "http://localhost:3000/api/product/add";
      
      await axios[method](url, formData, config);
      setModalOpen(false);
      fetchInitialData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-gray-50/50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Products</h1>
        <button 
          onClick={() => { 
            setIsEdit(false); 
            setFormData({name:"", category:"", supplier:"", price:"", stock:"", description:""}); 
            setModalOpen(true); 
          }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-blue-700 transition shadow-lg"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search products or categories..." 
          className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Product Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Stock</th> {/* Changed from Description to Stock */}
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-gray-800">{p.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {p.category?.categoryName || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.supplier?.name || "No Supplier"}</td>
                  <td className="px-6 py-4 text-blue-600 font-semibold">Rs. {p.price}</td>
                  <td className="px-6 py-4">
                    {/* Stock display with conditional coloring */}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      p.stock <= 5 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                    }`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => {
                        setFormData({ 
                            name: p.name, 
                            category: p.category?._id, 
                            supplier: p.supplier?._id,
                            price: p.price, 
                            stock: p.stock, 
                            description: p.description 
                        });
                        setSelectedId(p._id);
                        setIsEdit(true);
                        setModalOpen(true);
                      }} 
                      className="p-2 text-blue-600 cursor-pointer hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={async () => {
                        if (window.confirm("Delete product?")) {
                            await axios.delete(`http://localhost:3000/api/product/delete/${p._id}`, {
                                headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
                            });
                            fetchInitialData();
                        }
                      }} 
                      className="p-2 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">{isEdit ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Product Name" className="w-full p-3 border rounded-xl outline-none focus:border-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              
              <div className="grid grid-cols-2 gap-4">
                <select 
                    className="w-full p-3 border rounded-xl" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                        <option key={c._id} value={c._id}>
                        {c.categoryName} {/* Matches CategoryModel field 'categoryName' */}
                        </option>
                    ))}
                </select>

                <select 
                    className="w-full p-3 border rounded-xl" 
                    value={formData.supplier} 
                    onChange={e => setFormData({...formData, supplier: e.target.value})}
                >
                    <option value="">Select Supplier (Optional)</option>
                    {suppliers.map(s => (
                        <option key={s._id} value={s._id}>
                        {s.name} {/* Matches SupplierModel field 'name' */}
                        </option>
                    ))}
                </select>
              </div>

              <div className="flex gap-4">
                <input type="number" placeholder="Price (Rs.)" className="w-full p-3 border rounded-xl outline-none focus:border-blue-500" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                <input type="number" placeholder="Stock" className="w-full p-3 border rounded-xl outline-none focus:border-blue-500" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
              </div>

              <textarea 
                placeholder="Product Description (optional)" 
                className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 resize-none" 
                rows="3"
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
              />

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 font-semibold transition">Cancel</button>
                <button type="submit" className="flex-1 p-3 bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-blue-700 font-semibold shadow-md transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;