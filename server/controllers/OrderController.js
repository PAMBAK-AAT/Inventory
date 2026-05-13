

import OrderModel from "../models/Order.js";
import ProductModel from "../models/product.js";

const addOrder = async (req, res) => {
    try {
        const {productId, quantity, total} = req.body;
        const userId = req.user._id;
        
        const product = await ProductModel.findById({_id: productId});
        if(!product){
            return res.status(400).json({error: "product not found in order"});
        }

        if(quantity > product.stock){
            return res.status(400).json({error: "Insufficient stock for the product"});
        } else {
            product.stock -= parseInt(quantity);
            await product.save();
        }

        // FIXED: Changed 'newOrder' to 'new OrderModel'
        const orderObj = new OrderModel({
            customer: userId,
            product: productId,
            quantity,
            totalPrice: total 
        })

        await orderObj.save();
        return res.status(200).json({success: true, message: "Order placed successfully", order: orderObj});
    } catch (error) {
        console.error(error); // Add console.log to see exact backend errors
        return res.status(500).json({success: false, message: "Internal server error"});
    
    }
}

const getOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        let query = {};
        if(req.user.role === 'customer'){
            query = {customer: userId};
        }
        const orders = await OrderModel.find(query)
            .populate({
                path: 'product',
                select: 'name price',
                populate: { 
                    path: 'category',
                    select: 'categoryName'
                } 
            })
            .populate('customer', 'name email');

        // FIXED: Added the return response to send data to the frontend
        return res.status(200).json({ 
            success: true, 
            orders 
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error in fetching orders" 
        });
    }
}




export {addOrder, getOrders}