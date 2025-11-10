
import React from 'react';
import { FaHome, FaTable, FaBox, FaShoppingCart, FaTruck, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // We'll need this for logout

const Sidebar = () => {
    const { logout } = useAuth(); // Get logout function from context

    // Your menu items
    const menuItems = [
        { name: "Dashboard", path: "/admin-dashboard", icon: <FaHome />, isParent: true },
        { name: "Categories", path: "/admin-dashboard/categories", icon: <FaTable />, isParent: false },
        { name: "Products", path: "/admin-dashboard/products", icon: <FaBox />, isParent: false },
        { name: "Suppliers", path: "/admin-dashboard/suppliers", icon: <FaTruck />, isParent: false },
        { name: "Orders", path: "/admin-dashboard/orders", icon: <FaShoppingCart />, isParent: false },
        { name: "Users", path: "/admin-dashboard/users", icon: <FaUsers />, isParent: false },
        { name: "Profile", path: "/admin-dashboard/profile", icon: <FaCog />, isParent: false },
    ];

    // Separate logout item for special styling
    const logoutItem = {
        name: "Logout",
        icon: <FaSignOutAlt />,
    };

    return (
        // Main container: Added softer colors, right border, and smooth transition
        <div className='flex flex-col h-screen p-3 bg-slate-900 text-slate-100 w-16 md:w-64 fixed transition-all duration-300 ease-in-out border-r border-slate-700'>
            
            {/* Logo/Header */}
            <div className='h-16 flex items-center justify-center border-b border-slate-700'>
                <NavLink to="/admin/dashboard" className="flex items-center justify-center gap-2">
                    {/* Your existing responsive logo logic was perfect */}
                    <span className='hidden md:block text-2xl font-bold text-white tracking-tight'>Inventory MS</span>
                    <span className='md:hidden text-2xl font-bold text-white'>IMS</span>
                </NavLink>
            </div>

            {/* Navigation Links: Added flex-1 to make it fill the space */}
            <div className='flex-1 overflow-y-auto'>
                <ul className='space-y-2 px-2 py-4'>
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                end={item.isParent}
                                className={({ isActive }) =>
                                    (isActive
                                        ? "bg-blue-600 text-white shadow-lg" // Strong active style
                                        : "text-slate-300 hover:bg-slate-700 hover:text-white") +
                                    // Common styles:
                                    " flex items-center justify-center md:justify-start gap-4 p-3 rounded-lg transition-all duration-200"
                                }
                                to={item.path}
                            >
                                <span className='text-xl'>{item.icon}</span>
                                <span className='hidden md:block font-medium'>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Logout Section: Pushes itself to the bottom */}
            <div className='mt-auto pt-4 border-t border-slate-700'>
                <ul className='px-2'>
                    <li>
                        <button
                            onClick={logout} // Use the logout function from context
                            className="flex items-center justify-center md:justify-start gap-4 p-3 rounded-lg text-red-400 hover:bg-red-800 hover:text-white transition-all duration-200 w-full"
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











// import React from 'react'
// import  {FaHome, FaTable, FaBox, FaShoppingCart, FaTruck, FaUsers, FaCog, FaSignOutAlt} from 'react-icons/fa';
// import { NavLink } from 'react-router-dom';
// const Sidebar = () => {
//   const menuItems = [
//     { name: "Dashboard", path: "/admin-dashboard", icon: <FaHome />, isParent: true},
//     {name: "Categories", path: "/admin-dashboard/categories", icon: <FaTable />, isParent: false},
//     {name: "Products", path: "/admin-dashboard/products", icon: <FaBox />, isParent: false},
//     {name: "Suppliers", path: "/admin-dashboard/suppliers", icon: <FaTruck />, isParent: false},
//     {name: "Orders", path: "/admin-dashboard/orders", icon: <FaShoppingCart />, isParent: false},
//     {name: "Users", path: "/admin-dashboard/users", icon: <FaUsers />, isParent: false},
//     {name: "Profile", path: "/admin-dashboard/profile", icon: <FaCog />, isParent: false},
//     {name: "logout", path: "/logout", icon: <FaSignOutAlt />, isParent: false},
//   ]
//   return (
//     <div className='flex flex-col h-screen p-3 bg-black text-white w-16 md:w-64 fixed'>
//         <div className='h-16 flex flex-items justify-center'>
//             <span className='hidden md:block text-xl font-bold'>Inventory MS</span>
//             <span className='md:hidden text-xl font-bold'>IMS</span>
//         </div>

//         <div>
//             <ul className='space-y-2 p-2'>
//                 {menuItems.map( (item) => (
//                     <li key={item.name} >
//                         <NavLink
//                         end={item.isParent}
//                         className={({isActive}) => (isActive ? "bg-gray-700": "") + "flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"}
//                         to={item.path}>
//                             <span className='text-xl'>{item.icon}</span>
//                             <span className='hidden md:block'>{item.name}</span>
//                         </NavLink>
//                     </li>
//                 ) )}
//             </ul>
//         </div>
//     </div>
//   )
// }

// export default Sidebar
