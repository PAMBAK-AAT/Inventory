// // import axios from "axios";
// // import React, { useState, useEffect } from "react";
// // import { Search, Loader2, Package, Tag } from "lucide-react";

// // const CustomerProducts = () => {
// //   const [products, setProducts] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState("");

// //   const fetchProducts = async () => {
// //     setLoading(true);
// //     try {
// //       // If customer routes are protected, keep the config. 
// //       // If this is a public page, you can remove the config/token later.
// //       const config = { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } };
      
// //       const res = await axios.get("http://localhost:3000/api/product", config);
// //       setProducts(res.data.products || []);
// //     } catch (error) {
// //       console.error("Fetch error", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => { 
// //     fetchProducts(); 
// //   }, []);

// //   const filteredProducts = products.filter(p => 
// //     p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //     p.category?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
// //   );

// //   return (
// //     <div className="w-full min-h-screen p-4 md:p-8 bg-gray-50/50">
      
// //       {/* Header & Search */}
// //       <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
// //         <div>
// //           <h1 className="text-3xl font-extrabold text-gray-900">Product Catalog</h1>
// //           <p className="text-gray-500 mt-1">Browse our latest collection</p>
// //         </div>

// //         <div className="relative w-full md:w-96">
// //           <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
// //           <input 
// //             type="text" 
// //             placeholder="Search products or categories..." 
// //             className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white shadow-sm"
// //             value={searchQuery}
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //           />
// //         </div>
// //       </div>

// //       {/* Product Grid */}
// //       {loading ? (
// //         <div className="flex justify-center items-center h-64">
// //           <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
// //         </div>
// //       ) : filteredProducts.length === 0 ? (
// //         <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
// //           <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
// //           <h3 className="text-xl font-bold text-gray-700">No products found</h3>
// //           <p className="text-gray-400">Try adjusting your search terms.</p>
// //         </div>
// //       ) : (
// //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// //           {filteredProducts.map((p) => (
// //             <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
              
// //               {/* Product Info */}
// //               <div className="p-6 flex-1 flex flex-col">
// //                 <div className="flex justify-between items-start mb-4">
// //                   <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
// //                     <Tag size={12} />
// //                     {p.category?.categoryName || "Uncategorized"}
// //                   </span>
                  
// //                   {/* Customer-friendly stock display */}
// //                   {p.stock === 0 ? (
// //                     <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-bold">Out of Stock</span>
// //                   ) : p.stock <= 5 ? (
// //                     <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-xs font-bold">Low Stock</span>
// //                   ) : (
// //                     <span className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-xs font-bold">In Stock</span>
// //                   )}
// //                 </div>

// //                 <h3 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h3>
                
// //                 {/* Description snippet if it exists */}
// //                 {p.description && (
// //                   <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
// //                     {p.description}
// //                   </p>
// //                 )}

// //                 <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
// //                   <span className="text-2xl font-black text-blue-600">
// //                     Rs. {p.price}
// //                   </span>
// //                   {p.stock > 0 && (
// //                      <button className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition">
// //                         View Details
// //                      </button>
// //                   )}
// //                 </div>
// //               </div>

// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default CustomerProducts;

// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import { Search, Loader2, Package, Tag, X, ShoppingBag } from "lucide-react";

// const CustomerProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const config = { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } };
//       const res = await axios.get("http://localhost:3000/api/product", config);
//       setProducts(res.data.products || []);
//     } catch (error) {
//       console.error("Fetch error", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { 
//     fetchProducts(); 
//   }, []);

//   const filteredProducts = products.filter(p => 
//     p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     p.category?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="w-full min-h-screen p-4 md:p-8 bg-gray-50/50 relative">
      
//       {/* Header & Search */}
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-extrabold text-gray-900">Product Catalog</h1>
//           <p className="text-gray-500 mt-1">Browse our latest collection</p>
//         </div>

//         <div className="relative w-full md:w-96">
//           <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
//           <input 
//             type="text" 
//             placeholder="Search products or categories..." 
//             className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white shadow-sm"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Product Grid */}
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
//         </div>
//       ) : filteredProducts.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
//           <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
//           <h3 className="text-xl font-bold text-gray-700">No products found</h3>
//           <p className="text-gray-400">Try adjusting your search terms.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {filteredProducts.map((p) => (
//             <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
              
//               <div className="p-6 flex-1 flex flex-col">
//                 <div className="flex justify-between items-start mb-4">
//                   <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
//                     <Tag size={12} />
//                     {p.category?.categoryName || "Uncategorized"}
//                   </span>
                  
//                   {p.stock === 0 ? (
//                     <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-bold">Out of Stock</span>
//                   ) : p.stock <= 5 ? (
//                     <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-xs font-bold">Low Stock</span>
//                   ) : (
//                     <span className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-xs font-bold">In Stock</span>
//                   )}
//                 </div>

//                 <h3 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h3>
                
//                 {p.description && (
//                   <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
//                     {p.description}
//                   </p>
//                 )}

//                 <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
//                   <span className="text-2xl font-black text-blue-600">
//                     Rs. {p.price}
//                   </span>
//                   {p.stock > 0 && (
//                      <button 
//                         onClick={() => setSelectedProduct(p)}
//                         className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition cursor-pointer"
//                      >
//                         View Details
//                      </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Product Details Modal */}
//       {selectedProduct && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
//           <div className="bg-white rounded-3xl p-8 max-w-lg w-full relative shadow-2xl transform transition-all">
            
//             <button 
//               onClick={() => setSelectedProduct(null)} 
//               className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition cursor-pointer"
//             >
//               <X size={20} />
//             </button>

//             <div className="mb-4">
//                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold mb-3">
//                  <Tag size={14} />
//                  {selectedProduct.category?.categoryName || "Uncategorized"}
//                </span>
//                <h2 className="text-3xl font-extrabold text-gray-900">{selectedProduct.name}</h2>
//             </div>

//             <div className="py-4 border-y border-gray-100 my-4">
//               <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
//               <p className="text-gray-700 leading-relaxed">
//                 {selectedProduct.description || "No detailed description available for this product."}
//               </p>
//             </div>

//             <div className="flex justify-between items-end mt-6">
//                <div>
//                   <p className="text-sm text-gray-500 font-medium mb-1">Price</p>
//                   <span className="text-4xl font-black text-blue-600">
//                     Rs. {selectedProduct.price}
//                   </span>
//                </div>
               
//                <button 
//                  onClick={() => {
//                     alert(`Added ${selectedProduct.name} to cart!`);
//                     setSelectedProduct(null);
//                  }}
//                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition cursor-pointer"
//                >
//                  <ShoppingBag size={20} />
//                  Add to Cart
//                </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default CustomerProducts;



import axios from "axios";
import React, { useState, useEffect } from "react";
import { Search, Loader2, Package, Tag, ShoppingCart } from "lucide-react";

const CustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // States for the Order Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [orderData, setOrderData] = useState({
    productId: "",
    quantity: 1,
    total: 0,
    stock: 0,
    price: 0
  })

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } };
      const res = await axios.get("http://localhost:3000/api/product", config);
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle the actual order placement
  const handlePlaceOrder = async (e) => {
      e.preventDefault();
      
      // TODO: In the future, you will make your axios POST request here:
      
      try {
          const response = await axios.post("http://localhost:3000/api/orders/add",orderData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          });
          if(response.data.success){
            setOrderModalOpen(false);
            setOrderData({
              productId: "", quantity: 1, stock: 0, total: 0, price: 0
            })
          }
      } catch (error) {
          console.error("Error placing order:", error);
      }
      

      // For now, just show a success alert and close the modal
      alert(`Order placed successfully for ${quantity}x ${selectedProduct.name}.`);
      setOrderModalOpen(false);
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-gray-50/50 relative">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Product Catalog</h1>
          <p className="text-gray-500 mt-1">Browse our latest collection</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products or categories..." 
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700">No products found</h3>
          <p className="text-gray-400">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
                    <Tag size={12} />
                    {p.category?.categoryName || "Uncategorized"}
                  </span>
                  
                  {p.stock === 0 ? (
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-bold">Out of Stock</span>
                  ) : p.stock <= 5 ? (
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-xs font-bold">Low Stock</span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-xs font-bold">In Stock</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h3>
                
                {p.description && (
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                    {p.description}
                  </p>
                )}

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-2xl font-black text-blue-600">
                    Rs. {p.price}
                  </span>
                  {p.stock > 0 && (
                     <button 
                        onClick={() => {
                            setSelectedProduct(p);
                            setQuantity(1); // Reset quantity to 1 when opening modal
                            setOrderModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-600/20 transition cursor-pointer"
                     >
                        <ShoppingCart size={16} />
                        Order
                     </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Modal (Using the exact styling from your Product.jsx) */}
      {orderModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Place Order</h2>
            <p className="text-gray-500 mb-6">Create a new order for this item.</p>
            
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              
              {/* Product Info Display */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">{selectedProduct.name}</h3>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Price per unit:</span>
                      <span className="font-semibold text-gray-700">Rs. {selectedProduct.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Available Stock:</span>
                      <span className="font-semibold text-gray-700">{selectedProduct.stock} units</span>
                  </div>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  max={selectedProduct.stock} // Prevents ordering more than what is in stock
                  placeholder="Quantity" 
                  className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition" 
                  value={quantity} 
                  onChange={e => setQuantity(Number(e.target.value))} 
                  required 
                />
              </div>

              {/* Total Price Calculation */}
              <div className="flex justify-between items-center py-4 border-t border-b border-gray-100 my-4">
                  <span className="text-gray-600 font-medium">Total Amount:</span>
                  <span className="text-3xl font-black text-blue-600">
                      Rs. {selectedProduct.price * quantity}
                  </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setOrderModalOpen(false)} 
                  className="flex-1 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 font-semibold transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 p-3 bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-blue-700 font-semibold shadow-md transition flex justify-center items-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Confirm Order
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerProducts;