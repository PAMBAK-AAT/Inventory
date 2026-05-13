import React, { useState, useEffect } from 'react';
import { FaHome, FaTable, FaBox, FaShoppingCart, FaTruck, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom'; // 1. Added useLocation
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth(); 
    const location = useLocation(); // 2. Get the current URL path

    // Admin menu items
    const adminItems = [
        { name: "Dashboard", path: "/admin-dashboard", icon: <FaHome />, isParent: true },
        { name: "Categories", path: "/admin-dashboard/categories", icon: <FaTable />, isParent: false },
        { name: "Products", path: "/admin-dashboard/products", icon: <FaBox />, isParent: false },
        { name: "Suppliers", path: "/admin-dashboard/suppliers", icon: <FaTruck />, isParent: false },
        { name: "Orders", path: "/admin-dashboard/orders", icon: <FaShoppingCart />, isParent: false },
        { name: "Users", path: "/admin-dashboard/users", icon: <FaUsers />, isParent: false },
        { name: "Profile", path: "/admin-dashboard/profile", icon: <FaCog />, isParent: false },
    ];

    // Customer/Staff menu items
    const customerItems = [
        
        { name: "Products", path: "/customer-dashboard", icon: <FaBox />, isParent: false },
        { name: "Orders", path: "/customer-dashboard/orders", icon: <FaShoppingCart />, isParent: false },
        { name: "Profile", path: "/customer-dashboard/profile", icon: <FaCog />, isParent: false },
    ];

    const [menuLinks, setMenuLinks] = useState([]);

    // 3. Update links based on the URL path instead of just the user role
    useEffect(() => {
        if (location.pathname.includes("/admin-dashboard")) {
            setMenuLinks(adminItems);
        } else if (location.pathname.includes("/customer-dashboard")) {
            setMenuLinks(customerItems);
        } else {
            // Fallback just in case
            setMenuLinks(user?.role === "admin" ? adminItems : customerItems);
        }
    }, [location.pathname, user]); 
    
    // Separate logout item for special styling
    const logoutItem = { name: "Logout", icon: <FaSignOutAlt /> };

    // 4. Ensure the Logo click goes to the correct dashboard based on current URL
    const homePath = location.pathname.includes("/admin-dashboard") 
        ? "/admin-dashboard" 
        : "/customer-dashboard";

    return (
        <div className='flex flex-col h-screen p-3 bg-slate-900 text-slate-100 w-16 md:w-64 fixed transition-all duration-300 ease-in-out border-r border-slate-700 z-50'>
            
            {/* Logo/Header */}
            <div className='h-16 flex items-center justify-center border-b border-slate-700'>
                <NavLink to={homePath} className="flex items-center justify-center gap-2">
                    <span className='hidden md:block text-2xl font-bold text-white tracking-tight'>Inventory MS</span>
                    <span className='md:hidden text-2xl font-bold text-white'>IMS</span>
                </NavLink>
            </div>

            {/* Navigation Links */}
            <div className='flex-1 overflow-y-auto'>
                <ul className='space-y-2 px-2 py-4'>
                    {menuLinks.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                end={item.isParent}
                                to={item.path}
                                className={({ isActive }) =>
                                    (isActive
                                        ? "bg-blue-600 text-white shadow-lg" 
                                        : "text-slate-300 hover:bg-slate-700 hover:text-white") +
                                    " flex items-center justify-center md:justify-start gap-4 p-3 rounded-lg transition-all duration-200"
                                }
                            >
                                <span className='text-xl'>{item.icon}</span>
                                <span className='hidden md:block font-medium'>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Logout Section */}
            <div className='mt-auto pt-4 border-t border-slate-700'>
                <ul className='px-2'>
                    <li>
                        <button
                            onClick={logout}
                            className="cursor-pointer flex items-center justify-center md:justify-start gap-4 p-3 rounded-lg text-red-400 hover:bg-red-800 hover:text-white transition-all duration-200 w-full"
                        >
                            <span className='text-xl'>{logoutItem.icon}</span>
                            <span className='hidden md:block font-medium'>{logoutItem.name}</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;