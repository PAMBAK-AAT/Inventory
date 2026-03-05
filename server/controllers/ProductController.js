

import ProductModel from "../models/product.js";

export const addProduct = async (req, res) => {
    try{
        const newProduct = new ProductModel(req.body);
        await newProduct.save();
        return res.status(201).json({success: true, message: "Product added successfully"});
    }
    catch(error){
        res.status(500).json({success: false, message: "Internal server error, so product not  saved."});
    }
}

export const getProducts = async (req, res) => {
    try {
        // .populate helps get the name of category instead of just the ID
        const products = await ProductModel.find().populate('categoryName', 'name')
        .populate('name', 'name');
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const updateProduct = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Product updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




