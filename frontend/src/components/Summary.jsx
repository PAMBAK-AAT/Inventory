// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//     Package, 
//     ShoppingCart, 
//     DollarSign, 
//     TrendingUp, 
//     AlertTriangle, 
//     AlertCircle, 
//     Award, 
//     ArrowUpRight,
//     Loader2
// } from 'lucide-react';

// const Summary = () => {
//     const [loading, setLoading] = useState(true);
//     const [dashboardData, setDashboardData] = useState({
//         totalProducts: 0,
//         totalStock: 0,
//         ordersToday: 0,
//         revenue: 0,
//         outOfStock: [],
//         highestSaleProduct: null,
//         lowStock: []
//     });

//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             setLoading(true);
//             try {
//                 const config = { 
//                     headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } 
//                 };
                
//                 // 1. Fetch data from your existing backend routes
//                 const [prodRes, orderRes] = await Promise.all([
//                     axios.get("http://localhost:3000/api/product", config),
//                     // Make sure this endpoint returns ALL orders for the admin dashboard
//                     axios.get("http://localhost:3000/api/order", config).catch(() => ({ data: { orders: [] } }))
//                 ]);

//                 const products = prodRes.data.products || [];
//                 const orders = orderRes.data.orders || [];

//                 // 2. Calculate Product Statistics
//                 let totalStock = 0;
//                 const outOfStock = [];
//                 const lowStock = [];

//                 products.forEach(p => {
//                     totalStock += (p.stock || 0);
//                     if (p.stock === 0) {
//                         outOfStock.push(p);
//                     } else if (p.stock <= 5) {
//                         lowStock.push(p);
//                     }
//                 });

//                 // 3. Calculate Order & Revenue Statistics
//                 let revenue = 0;
//                 let ordersToday = 0;
//                 const productSales = {}; // To track which product sold the most

//                 // Get today's date starting at midnight
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0);

//                 orders.forEach(o => {
//                     revenue += (o.totalPrice || 0);
                    
//                     // Check if order was placed today
//                     const orderDate = new Date(o.orderDate);
//                     if (orderDate >= today) {
//                         ordersToday++;
//                     }

//                     // Tally sales per product to find the highest seller
//                     const pId = o.product?._id || o.product;
//                     if (pId) {
//                         if (!productSales[pId]) {
//                             productSales[pId] = { qty: 0, revenue: 0 };
//                         }
//                         productSales[pId].qty += o.quantity;
//                         productSales[pId].revenue += (o.totalPrice || 0);
//                     }
//                 });

//                 // 4. Determine Highest Selling Product
//                 let highestSaleProduct = null;
//                 let maxQty = 0;
//                 let topProductId = null;

//                 for (const [pId, data] of Object.entries(productSales)) {
//                     if (data.qty > maxQty) {
//                         maxQty = data.qty;
//                         topProductId = pId;
//                     }
//                 }

//                 if (topProductId) {
//                     const topProdDetails = products.find(p => p._id === topProductId);
//                     if (topProdDetails) {
//                         highestSaleProduct = {
//                             name: topProdDetails.name,
//                             sales: maxQty,
//                             revenue: productSales[topProductId].revenue,
//                             image: '🏆' 
//                         };
//                     }
//                 }

//                 // 5. Update the state with calculated real data
//                 setDashboardData({
//                     totalProducts: products.length,
//                     totalStock,
//                     ordersToday,
//                     revenue,
//                     outOfStock,
//                     highestSaleProduct,
//                     lowStock
//                 });

//             } catch (error) {
//                 console.error("Failed to fetch dashboard data", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDashboardData();
//     }, []);

//     if (loading) {
//         return (
//             <div className="w-full h-[80vh] flex flex-col items-center justify-center">
//                 <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
//                 <p className="text-gray-500 font-medium">Loading Real-Time Analytics...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
            
//             {/* Page Header */}
//             <div className="mb-8 flex justify-between items-end">
//                 <div>
//                     <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Overview</h1>
//                     <p className="text-gray-500 mt-1">Welcome back. Here is your live business data.</p>
//                 </div>
//                 <div className="hidden md:block text-sm font-semibold text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
//                     {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
//                 </div>
//             </div>

//             {/* KPI Cards Section - Top Row */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
//                 {/* Revenue Card */}
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
//                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
//                         <DollarSign size={80} className="text-green-500 transform translate-x-4 -translate-y-4" />
//                     </div>
//                     <div className="flex justify-between items-start mb-4 relative z-10">
//                         <div className="p-3 bg-green-100 text-green-600 rounded-xl">
//                             <DollarSign size={24} />
//                         </div>
//                         <span className="flex items-center text-green-500 text-sm font-bold bg-green-50 px-2 py-1 rounded-lg">
//                             Live <ArrowUpRight size={16} className="ml-1" />
//                         </span>
//                     </div>
//                     <h3 className="text-gray-500 font-semibold mb-1">Total Revenue</h3>
//                     <p className="text-3xl font-black text-gray-800">Rs. {dashboardData.revenue.toLocaleString()}</p>
//                 </div>

//                 {/* Orders Card */}
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
//                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
//                         <ShoppingCart size={80} className="text-blue-500 transform translate-x-4 -translate-y-4" />
//                     </div>
//                     <div className="flex justify-between items-start mb-4 relative z-10">
//                         <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
//                             <ShoppingCart size={24} />
//                         </div>
//                         <span className="flex items-center text-blue-500 text-sm font-bold bg-blue-50 px-2 py-1 rounded-lg">
//                             Today
//                         </span>
//                     </div>
//                     <h3 className="text-gray-500 font-semibold mb-1">New Orders</h3>
//                     <p className="text-3xl font-black text-gray-800">{dashboardData.ordersToday}</p>
//                 </div>

//                 {/* Products Card */}
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
//                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
//                         <Package size={80} className="text-purple-500 transform translate-x-4 -translate-y-4" />
//                     </div>
//                     <div className="flex justify-between items-start mb-4 relative z-10">
//                         <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
//                             <Package size={24} />
//                         </div>
//                     </div>
//                     <h3 className="text-gray-500 font-semibold mb-1">Total Products</h3>
//                     <p className="text-3xl font-black text-gray-800">{dashboardData.totalProducts}</p>
//                 </div>

//                 {/* Stock Card */}
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
//                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
//                         <TrendingUp size={80} className="text-orange-500 transform translate-x-4 -translate-y-4" />
//                     </div>
//                     <div className="flex justify-between items-start mb-4 relative z-10">
//                         <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
//                             <TrendingUp size={24} />
//                         </div>
//                     </div>
//                     <h3 className="text-gray-500 font-semibold mb-1">Total Items in Stock</h3>
//                     <p className="text-3xl font-black text-gray-800">{dashboardData.totalStock.toLocaleString()}</p>
//                 </div>
//             </div>

//             {/* Main Content Grid - Middle Row */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
//                 {/* Left Column: Alerts (Out of Stock & Low Stock) */}
//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* Out of Stock Section */}
//                     <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 relative overflow-hidden">
//                         <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
//                         <div className="flex items-center gap-3 mb-6">
//                             <div className="p-2 bg-red-100 text-red-600 rounded-lg">
//                                 <AlertCircle size={24} />
//                             </div>
//                             <h3 className="text-xl font-bold text-gray-800">Critical: Out of Stock</h3>
//                             <span className="ml-auto bg-red-100 text-red-600 py-1 px-3 rounded-full text-sm font-bold">
//                                 {dashboardData.outOfStock.length} Items
//                             </span>
//                         </div>

//                         {dashboardData.outOfStock.length > 0 ? (
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 {dashboardData.outOfStock.map((product) => (
//                                     <div key={product._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
//                                         <div>
//                                             <p className="font-bold text-gray-800">{product.name}</p>
//                                             <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
//                                                 {product.category?.categoryName || "Uncategorized"}
//                                             </p>
//                                         </div>
//                                         <button className="text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition">Restock</button>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100 text-green-700 font-semibold">
//                                 All products are currently in stock!
//                             </div>
//                         )}
//                     </div>

//                     {/* Low Stock Section */}
//                     <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 relative overflow-hidden">
//                         <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
//                         <div className="flex items-center gap-3 mb-6">
//                             <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
//                                 <AlertTriangle size={24} />
//                             </div>
//                             <h3 className="text-xl font-bold text-gray-800">Warning: Low Stock</h3>
//                         </div>

//                         {dashboardData.lowStock.length > 0 ? (
//                             <div className="space-y-3">
//                                 {dashboardData.lowStock.map((product) => (
//                                     <div key={product._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl border border-gray-100 transition">
//                                         <span className="font-semibold text-gray-700">{product.name}</span>
//                                         <div className="flex items-center gap-4">
//                                             <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
//                                                 Only {product.stock} left
//                                             </span>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <p className="text-gray-500 italic">No low stock warnings.</p>
//                         )}
//                     </div>
//                 </div>

//                 {/* Right Column: Highest Sale Product & Quick Stats */}
//                 <div className="space-y-6">
                    
//                     {/* Star Product Card */}
//                     <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
//                         <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
                        
//                         <div className="flex items-center gap-2 text-yellow-400 mb-6">
//                             <Award size={24} />
//                             <h3 className="text-lg font-bold uppercase tracking-wider">Top Seller</h3>
//                         </div>

//                         {dashboardData.highestSaleProduct ? (
//                             <div className="text-center pb-4">
//                                 <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto flex items-center justify-center text-4xl mb-4 shadow-inner">
//                                     {dashboardData.highestSaleProduct.image || <Package size={32} className="text-gray-400" />}
//                                 </div>
//                                 <h4 className="text-2xl font-black mb-2">{dashboardData.highestSaleProduct.name}</h4>
//                                 <div className="grid grid-cols-2 gap-4 mt-6">
//                                     <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
//                                         <p className="text-gray-400 text-xs uppercase font-bold mb-1">Units Sold</p>
//                                         <p className="text-xl font-bold">{dashboardData.highestSaleProduct.sales}</p>
//                                     </div>
//                                     <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
//                                         <p className="text-gray-400 text-xs uppercase font-bold mb-1">Revenue</p>
//                                         <p className="text-xl font-bold text-green-400">Rs. {dashboardData.highestSaleProduct.revenue}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : (
//                             <p className="text-gray-400 text-center py-10">Not enough data to determine top seller yet.</p>
//                         )}
//                     </div>

//                     {/* Quick Actions */}
//                     <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                         <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
//                         <div className="space-y-3">
//                             <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition font-semibold text-gray-700 hover:text-blue-700 flex justify-between items-center cursor-pointer">
//                                 Add New Product <ArrowUpRight size={18} />
//                             </button>
//                             <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition font-semibold text-gray-700 hover:text-blue-700 flex justify-between items-center cursor-pointer">
//                                 View All Orders <ArrowUpRight size={18} />
//                             </button>
//                         </div>
//                     </div>

//                 </div>
//             </div>

//         </div>
//     );
// };

// export default Summary;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    Package, 
    ShoppingCart, 
    DollarSign, 
    TrendingUp, 
    AlertTriangle, 
    AlertCircle, 
    Award, 
    ArrowUpRight,
    Loader2
} from 'lucide-react';

const Summary = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalStock: 0,
        ordersToday: 0,
        revenue: 0,
        outOfStock: [],
        highestSaleProduct: null,
        lowStock: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const config = { 
                    headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` } 
                };
                
                // Fetch data from your existing backend routes
                const [prodRes, orderRes] = await Promise.all([
                    axios.get("http://localhost:3000/api/product", config),
                    // Catch added just in case there are no orders yet
                    axios.get("http://localhost:3000/api/order", config).catch(() => ({ data: { orders: [] } }))
                ]);

                const products = prodRes.data.products || [];
                const orders = orderRes.data.orders || [];

                // Calculate Product Statistics
                let totalStock = 0;
                const outOfStock = [];
                const lowStock = [];

                products.forEach(p => {
                    totalStock += (p.stock || 0);
                    if (p.stock === 0) {
                        outOfStock.push(p);
                    } else if (p.stock <= 5) {
                        lowStock.push(p);
                    }
                });

                // Calculate Order & Revenue Statistics
                let revenue = 0;
                let ordersToday = 0;
                const productSales = {}; 

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                orders.forEach(o => {
                    revenue += (o.totalPrice || 0);
                    
                    const orderDate = new Date(o.orderDate);
                    if (orderDate >= today) {
                        ordersToday++;
                    }

                    const pId = o.product?._id || o.product;
                    if (pId) {
                        if (!productSales[pId]) {
                            productSales[pId] = { qty: 0, revenue: 0 };
                        }
                        productSales[pId].qty += o.quantity;
                        productSales[pId].revenue += (o.totalPrice || 0);
                    }
                });

                // Determine Highest Selling Product
                let highestSaleProduct = null;
                let maxQty = 0;
                let topProductId = null;

                for (const [pId, data] of Object.entries(productSales)) {
                    if (data.qty > maxQty) {
                        maxQty = data.qty;
                        topProductId = pId;
                    }
                }

                if (topProductId) {
                    const topProdDetails = products.find(p => p._id === topProductId);
                    if (topProdDetails) {
                        highestSaleProduct = {
                            name: topProdDetails.name,
                            sales: maxQty,
                            revenue: productSales[topProductId].revenue,
                            image: '🏆' 
                        };
                    }
                }

                // Update the state
                setDashboardData({
                    totalProducts: products.length,
                    totalStock,
                    ordersToday,
                    revenue,
                    outOfStock,
                    highestSaleProduct,
                    lowStock
                });

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[80vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading Real-Time Analytics...</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
            
            {/* Page Header */}
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back. Here is your live business data.</p>
                </div>
                <div className="hidden md:block text-sm font-semibold text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* KPI Cards Section - Top Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Revenue Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={80} className="text-green-500 transform translate-x-4 -translate-y-4" />
                    </div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                        <span className="flex items-center text-green-500 text-sm font-bold bg-green-50 px-2 py-1 rounded-lg">
                            Live <ArrowUpRight size={16} className="ml-1" />
                        </span>
                    </div>
                    <h3 className="text-gray-500 font-semibold mb-1">Total Revenue</h3>
                    <p className="text-3xl font-black text-gray-800">Rs. {dashboardData.revenue.toLocaleString()}</p>
                </div>

                {/* Orders Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingCart size={80} className="text-blue-500 transform translate-x-4 -translate-y-4" />
                    </div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <ShoppingCart size={24} />
                        </div>
                        <span className="flex items-center text-blue-500 text-sm font-bold bg-blue-50 px-2 py-1 rounded-lg">
                            Today
                        </span>
                    </div>
                    <h3 className="text-gray-500 font-semibold mb-1">New Orders</h3>
                    <p className="text-3xl font-black text-gray-800">{dashboardData.ordersToday}</p>
                </div>

                {/* Products Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Package size={80} className="text-purple-500 transform translate-x-4 -translate-y-4" />
                    </div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            <Package size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 font-semibold mb-1">Total Products</h3>
                    <p className="text-3xl font-black text-gray-800">{dashboardData.totalProducts}</p>
                </div>

                {/* Stock Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={80} className="text-orange-500 transform translate-x-4 -translate-y-4" />
                    </div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 font-semibold mb-1">Total Items in Stock</h3>
                    <p className="text-3xl font-black text-gray-800">{dashboardData.totalStock.toLocaleString()}</p>
                </div>
            </div>

            {/* Main Content Grid - Middle Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Alerts (Out of Stock & Low Stock) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Out of Stock Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Critical: Out of Stock</h3>
                            <span className="ml-auto bg-red-100 text-red-600 py-1 px-3 rounded-full text-sm font-bold">
                                {dashboardData.outOfStock.length} Items
                            </span>
                        </div>

                        {dashboardData.outOfStock.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {dashboardData.outOfStock.map((product) => (
                                    <div key={product._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div>
                                            <p className="font-bold text-gray-800">{product.name}</p>
                                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                                                {product.category?.categoryName || "Uncategorized"}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => navigate('/products')}
                                            className="text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition"
                                        >
                                            Restock
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100 text-green-700 font-semibold">
                                All products are currently in stock!
                            </div>
                        )}
                    </div>

                    {/* Low Stock Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Warning: Low Stock</h3>
                        </div>

                        {dashboardData.lowStock.length > 0 ? (
                            <div className="space-y-3">
                                {dashboardData.lowStock.map((product) => (
                                    <div key={product._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl border border-gray-100 transition">
                                        <span className="font-semibold text-gray-700">{product.name}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                                                Only {product.stock} left
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No low stock warnings.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Highest Sale Product & Quick Stats */}
                <div className="space-y-6">
                    
                    {/* Star Product Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
                        
                        <div className="flex items-center gap-2 text-yellow-400 mb-6">
                            <Award size={24} />
                            <h3 className="text-lg font-bold uppercase tracking-wider">Top Seller</h3>
                        </div>

                        {dashboardData.highestSaleProduct ? (
                            <div className="text-center pb-4">
                                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto flex items-center justify-center text-4xl mb-4 shadow-inner">
                                    {dashboardData.highestSaleProduct.image || <Package size={32} className="text-gray-400" />}
                                </div>
                                <h4 className="text-2xl font-black mb-2">{dashboardData.highestSaleProduct.name}</h4>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                        <p className="text-gray-400 text-xs uppercase font-bold mb-1">Units Sold</p>
                                        <p className="text-xl font-bold">{dashboardData.highestSaleProduct.sales}</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                        <p className="text-gray-400 text-xs uppercase font-bold mb-1">Revenue</p>
                                        <p className="text-xl font-bold text-green-400">Rs. {dashboardData.highestSaleProduct.revenue}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-10">Not enough data to determine top seller yet.</p>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            {/* Manage Products Link */}
                            <button 
                                onClick={() => navigate('/api/product')}
                                className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition font-semibold text-gray-700 hover:text-blue-700 flex justify-between items-center cursor-pointer"
                            >
                                Manage Products <ArrowUpRight size={18} />
                            </button>
                            
                            {/* View Orders Link */}
                            <button 
                                onClick={() => navigate('/api/order')}
                                className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition font-semibold text-gray-700 hover:text-blue-700 flex justify-between items-center cursor-pointer"
                            >
                                View All Orders <ArrowUpRight size={18} />
                            </button>

                            {/* Manage Suppliers Link */}
                            <button 
                                onClick={() => navigate('/api/supplier')}
                                className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition font-semibold text-gray-700 hover:text-blue-700 flex justify-between items-center cursor-pointer"
                            >
                                Manage Suppliers <ArrowUpRight size={18} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Summary;