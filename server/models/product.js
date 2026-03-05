

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryModel', required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'SupplierModel' },
}, { timestamps: true });

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;