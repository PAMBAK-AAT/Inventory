



import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    FaPlus,
    FaCheckCircle,
    FaExclamationCircle,
    FaEdit,
    FaTrash,
    FaSpinner,
    FaTimes,
    FaSave
} from 'react-icons/fa';

const Categories = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [tableLoading, setTableLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [notification, setNotification] = useState({ message: null, type: '' });

    const fetchCategories = useCallback(async () => {
        setTableLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/category`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
            });
            if (response.data.success) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setNotification({ 
                message: error.response?.data?.message || "Could not fetch categories", 
                type: "error" 
            });
        } finally {
            setTableLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        if (notification.message) {
            const timer = setTimeout(() => {
                setNotification({ message: null, type: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleFormClear = () => {
        setCategoryName('');
        setCategoryDescription('');
        setIsEditMode(false);
        setEditingCategoryId(null);
    };

    const handleEditClick = (category) => {
        setIsEditMode(true);
        setEditingCategoryId(category._id);
        setCategoryName(category.categoryName);
        setCategoryDescription(category.categoryDescription || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (categoryId) => {
        if (!window.confirm("Are you sure you want to delete this category?")) {
            return;
        }
        
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/category/delete/${categoryId}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
                }
            );
            
            if (response.data.success) {
                setNotification({ message: "Category deleted successfully!", type: "success" });
                fetchCategories();
            } else {
                setNotification({ message: response.data.message || "Failed to delete category", type: "error" });
            }
        } catch (err) {
            console.error("Error deleting category:", err);
            setNotification({ message: err.response?.data?.message || "Failed to delete category", type: "error" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setNotification({ message: null, type: '' });

        const categoryData = { categoryName, categoryDescription };

        try {
            let response;
            if (isEditMode) {
                response = await axios.put(
                    `${import.meta.env.VITE_API_URL}/api/category/update/${editingCategoryId}`,
                    categoryData,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
                    }
                );
            } else {
                response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/category/add`,
                    categoryData,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
                    }
                );
            }

            if (response.data.success) {
                setNotification({ 
                    message: isEditMode ? "Category updated successfully!" : "Category added successfully!", 
                    type: "success" 
                });
                handleFormClear();
                fetchCategories(); 
            } else {
                setNotification({ message: response.data.message || "Operation failed", type: "error" });
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            const errorMsg = err.response?.data?.message || "Operation failed";
            setNotification({ message: errorMsg, type: "error" });
        } finally {
            setSubmitLoading(false);
        }
    };
    
    // --- STYLING & LAYOUT UPDATED TO MATCH SUMMARY.JSX ---
    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
            
            {/* Page Header matching Summary.jsx */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Category Management</h1>
                <p className="text-gray-500 mt-1">Organize and manage your product categories.</p>
            </div>

            {/* Notification component */}
            {notification.message && (
                <div 
                    className={`mb-6 p-4 rounded-xl shadow-sm border ${
                        notification.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                >
                    <span className="flex items-center text-sm font-bold">
                        {notification.type === 'success' ? <FaCheckCircle className="mr-3 text-lg text-green-600" /> : <FaExclamationCircle className="mr-3 text-lg text-red-600" />}
                        {notification.message}
                    </span>
                </div>
            )}

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* --- Left Column: Add/Edit Category Form --- */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                            {isEditMode ? <FaEdit className="text-blue-600" /> : <FaPlus className="text-blue-600" />}
                            {isEditMode ? 'Edit Category' : 'Add New Category'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="categoryName" className="block text-sm font-bold text-gray-700 mb-2">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    id="categoryName"
                                    placeholder="e.g. Engine Oil"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="categoryDescription" className="block text-sm font-bold text-gray-700 mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    id="categoryDescription"
                                    placeholder="e.g. All types of oil used in Trucks"
                                    value={categoryDescription}
                                    onChange={(e) => setCategoryDescription(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800"
                                />
                            </div>
                            
                            {/* Form Buttons */}
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all duration-200 cursor-pointer disabled:bg-gray-400 disabled:shadow-none"
                                >
                                    {submitLoading ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        isEditMode ? <FaSave /> : <FaPlus />
                                    )}
                                    {submitLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Category')}
                                </button>

                                {isEditMode && (
                                    <button
                                        type="button"
                                        onClick={handleFormClear}
                                        className="w-full flex justify-center items-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-bold hover:bg-gray-200 transition-all duration-200 cursor-pointer"
                                    >
                                        <FaTimes /> Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* --- Right Column: Category List Table --- */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {tableLoading ? (
                            <div className="flex flex-col justify-center items-center h-80">
                                <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
                                <p className="text-gray-500 font-medium">Loading categories...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">S.No</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category Name</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {categories.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="text-center text-gray-500 py-16 font-medium">
                                                    No categories found. Add one to get started.
                                                </td>
                                            </tr>
                                        ) : (
                                            categories.map((category, index) => (
                                                <tr key={category._id} className="hover:bg-gray-50 transition-colors duration-150">
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <span className="font-semibold text-gray-500">{index + 1}</span>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <span className="font-bold text-gray-800">{category.categoryName}</span>
                                                        {category.categoryDescription && (
                                                            <p className="text-sm text-gray-500 mt-1">{category.categoryDescription}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-center">
                                                        <div className="flex items-center justify-center space-x-3">
                                                            <button 
                                                                onClick={() => handleEditClick(category)}
                                                                className="flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-bold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200 cursor-pointer"
                                                            >
                                                                <FaEdit /> Edit
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteClick(category._id)}
                                                                className="flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-bold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200 cursor-pointer"
                                                            >
                                                                <FaTrash /> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

            </div> {/* End of grid layout */}
        </div>
    );
}

export default Categories;

