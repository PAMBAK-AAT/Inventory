


import SupplierModel from '../models/Supplier.js';

const addSupplier = async (req, res) => {
    try {
        const {name, email, number, address} = req.body;
        
        const existingSupplier = await SupplierModel.findOne({ name });
        if (existingSupplier) {
            return res.status(400).json({ success: false, message: "Supplier already exists" });
        }

        const newSupplier = new SupplierModel({ name, email, number, address });
        await newSupplier.save();
        return res.status(201).json({ success: true, message: "Supplier added successfully" });
    } catch (error) {
        console.error("Error adding Supplier:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}


const getSuppliers = async (req, res) => {
    try{
        const suppliers = await SupplierModel.find();
        return res.status(200).json({success: true, suppliers});
    }catch (error){
        console.error("Error fetching suppliers:", error);
        return res.status(500).json({success: false, message: "Server error in getting suppliers"});
    }
}

// Add this function to your existing controller
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSupplier = await SupplierModel.findByIdAndDelete(id);
        
        if (!deletedSupplier) {
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }
        
        return res.status(200).json({ success: true, message: "Supplier deleted successfully" });
    } catch (error) {
        console.error("Error deleting supplier:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export {addSupplier, getSuppliers, deleteSupplier};