

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTag, FaPlus, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// This is the main component for your page
// I'm assuming you'll create a `frontend/src/pages` folder for it
const Categories = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ message: null, type: '' });

    // This effect will make notifications disappear after 3 seconds
    useEffect(() => {
        if (notification.message) {
            const timer = setTimeout(() => {
                setNotification({ message: null, type: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotification({ message: null, type: '' }); // Clear previous notifications

        try {
            const response = await axios.post(
                "http://localhost:3000/api/category/add",
                { categoryName, categoryDescription },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("pos-token")}`
                    }
                }
            );

            if (response.data.success) {
                setNotification({ message: "Category added successfully!", type: "success" });
                setCategoryName("");
                setCategoryDescription("");
            } else {
                // This 'else' might not be hit if backend always throws errors
                setNotification({ message: response.data.message || "Failed to add category", type: "error" });
            }
        } catch (err) {
            // Handle errors thrown by axios (e.g., 401, 500)
            console.error("Error adding category:", err);
            const errorMsg = err.response?.data?.message || "Failed to add category";
            setNotification({ message: errorMsg, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        // Main page container
        // The ml-16 md:ml-64 accounts for your fixed sidebar
        <div className="ml-16 md:ml-64 p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Category Management
            </h1>

            {/* Notification component */}
            {notification.message && (
                <div 
                    className={`max-w-2xl mb-4 p-4 rounded-lg shadow-md ${
                        notification.type === 'success' 
                        ? 'bg-green-100 border border-green-400 text-green-700' 
                        : 'bg-red-100 border border-red-400 text-red-700'
                    }`}
                >
                    <span className="flex items-center">
                        {notification.type === 'success' ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
                        {notification.message}
                    </span>
                </div>
            )}

            {/* Form Card */}
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
                    <FaTag /> Add New Category
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Category Name Input */}
                    <div>
                        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name
                        </label>
                        <input
                            type="text"
                            id="categoryName"
                            placeholder="e.g., Engine Oil, Brake Pads etc."
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Category Description Input */}
                    <div>
                        <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-1">
                            Category Description (Optional)
                        </label>
                        <textarea
                            id="categoryDescription"
                            placeholder="A brief description of the category"
                            value={categoryDescription}
                            onChange={(e) => setCategoryDescription(e.target.value)}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading} // Disable button when loading
                            className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <FaPlus /> Add Category
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* We will add the Category List/Table component here later */}
            <div className="mt-8">
                {/* <CategoryList /> */}
            </div>

        </div>
    );
}

export default Categories;



// import React from 'react'

// const Categories = () => {
//   const [categoryName, setCategoryName] = React.useState('')
//   const [categoryDescription, setCategoryDescription] = React.useState('')

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const response = await axios.post("http://localhost:3000/api/category/add",
//       {categoryName, categoryDescription},
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("pos-token")}`
//         }
//       }
//      );

//     if(response.data.success){
//       alert("Category added successfully");
//       setCategoryName("");
//       setCategoryDescription("");
//     }else{
//       console.error("Error adding category:", data);
//       alert("Failed to add category");
//     }
//   }
//   return (
//     <div>
//       <h1>Category management</h1>

//       <div>
//         <div>
//           <div>
//             <h2>Add Category</h2>
//             <form onSubmit={handleSubmit}>
//               <div>
//                 <input type="text" placeholder="Category name" onChange={(e) => setCategoryName(e.target.value)} />
//               </div>
//               <div>
//                 <input type="text" placeholder="Category description" onChange={(e) => setCategoryDescription(e.target.value)} />
//               </div>
//               <button type="submit">
//                 Add Category
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>

//     </div>
//   )
// }

// export default Categories
