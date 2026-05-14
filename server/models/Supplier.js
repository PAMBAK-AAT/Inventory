// import mongoose from "mongoose"

// const supplierSchema = new mongoose.Schema({
//     name: { type: String, required: true},
//     email: {type: String, required: true},
//     number: {type: Number, required: true},
//     address: {type: String, required: true},
//     createdAt: {type: Date, default: Date.now},
// });

// const SupplierModel = mongoose.model("Supplier", supplierSchema);
// export default SupplierModel;

import mongoose from "mongoose"

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: {type: String, required: true},
    number: {type: Number, required: true},
    address: {type: String, required: true},
    // NEW: Real-world context / description of what they supply
    businessContext: { type: String, default: "General Supplier" }, 
    createdAt: {type: Date, default: Date.now},
});

const SupplierModel = mongoose.model("Supplier", supplierSchema);
export default SupplierModel;