
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
    // --- All your logic from before (no changes) ---
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
            const response = await axios.get("http://localhost:3000/api/category", {
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
                `http://localhost:3000/api/category/delete/${categoryId}`,
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
                    `http://localhost:3000/api/category/update/${editingCategoryId}`,
                    categoryData,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
                    }
                );
            } else {
                response = await axios.post(
                    "http://localhost:3000/api/category/add",
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
    
    // --- STYLING & LAYOUT ---
    return (
        // *** NOTE: I added ml-16 md:ml-64 back in. This is NEEDED to prevent your sidebar from covering your page. ***
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen animated-gradient">
            <h1 className="text-3xl font-bold text-white mb-6 drop-shadow-md">
                Category Management
            </h1>

            {/* Notification component */}
            {notification.message && (
                <div 
                    className={`mb-6 p-4 rounded-xl shadow-lg ${
                        notification.type === 'success' 
                        ? 'bg-green-100 border border-green-300 text-green-800' 
                        : 'bg-red-100 border border-red-300 text-red-800'
                    }`}
                >
                    <span className="flex items-center text-sm font-medium">
                        {notification.type === 'success' ? <FaCheckCircle className="mr-3 text-lg" /> : <FaExclamationCircle className="mr-3 text-lg" />}
                        {notification.message}
                    </span>
                </div>
            )}

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* --- Left Column: Add/Edit Category Form --- */}
                <div className="lg:col-span-2">
                    <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                            {isEditMode ? <FaEdit className="text-purple-600" /> : <FaPlus className="text-purple-600" />}
                            {isEditMode ? 'Edit Category' : 'Add New Category'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    id="categoryName"
                                    placeholder="e.g. Engine Oil"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-lg focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    id="categoryDescription"
                                    placeholder="e.g. All types of oil used in Trucks"
                                    value={categoryDescription}
                                    onChange={(e) => setCategoryDescription(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-lg focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                                />
                            </div>
                            
                            {/* Form Buttons */}
                            <div className="space-y-3 pt-3">
                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40 cursor-pointer disabled:bg-gray-400 disabled:shadow-none disabled:scale-100"
                                >
                                    {submitLoading ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        isEditMode ? <FaSave /> : <FaPlus />
                                    )}
                                    {/* --- 1. CHANGE HERE --- */}
                                    {submitLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Category')}
                                </button>

                                {/* --- 2. CHANGE HERE --- */}
                                {isEditMode && (
                                    <button
                                        type="button"
                                        onClick={handleFormClear}
                                        className="w-full flex justify-center items-center gap-2 bg-slate-100 text-slate-700 py-3 px-4 rounded-lg font-semibold shadow-sm border border-slate-200 transition-all duration-300 transform hover:bg-slate-200 hover:border-slate-300 cursor-pointer"
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
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                        {tableLoading ? (
                            <div className="flex justify-center items-center h-80">
                                <FaSpinner className="animate-spin text-5xl text-purple-500" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/50 border-b border-white/30">
                                        <tr>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-60t00 uppercase tracking-wider">Category Name</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200/50">
                                        {categories.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="text-center text-gray-700 py-16">
                                                    No categories found.
                                                </td>
                                            </tr>
                                        ) : (
                                            categories.map((category, index) => (
                                                <tr key={category._id} className="hover:bg-purple-100/50 transition-colors duration-150">
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <span className="font-normal text-gray-600">{index + 1}</span>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <span className="font-medium text-gray-900">{category.categoryName}</span>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-center">
                                                        <div className="flex items-center justify-center space-x-3">
                                                            <button 
                                                                onClick={() => handleEditClick(category)}
                                                                className="flex items-center justify-center gap-1.5 py-1.5 px-4 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full hover:bg-purple-200 transition-all duration-300 cursor-pointer"
                                                            >
                                                                <FaEdit /> Edit
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteClick(category._id)}
                                                                className="flex items-center justify-center gap-1.5 py-1.5 px-4 text-xs font-semibold text-red-700 bg-red-100 rounded-full hover:bg-red-200 transition-all duration-300 cursor-pointer"
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


