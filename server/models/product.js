

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    // Changed ref to 'Category' to match your Category.js model registration
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    // Changed ref to 'Supplier' to match your Supplier.js model registration
    supplier: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Supplier' 
    },
}, { timestamps: true });

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;