

const addOrder = async (req, res) => {

    try{
        const {productId, quantity, total} = req.body;
        const userId = req.user._id;
        const product = await Product.findById({_id: productId});
        if(!product){
            return res.status(400).json({error: "product not found in order"});
        }

        if(quantity >product.stock){
            return res.status(400).json({error: "Insufficient stock for the product"});
        }else{
            product.stock -= parseInt(quantity);
            await product.save();
        }

        const orderObj = newOrder({
            customer: userId,
            product: productId,
            quantity,
            totalPrice: total
        })

        await orderObj.save();
        return res.status(200).json({success: true, message: "Order placed successfully", order: orderObj});
    }catch(error){
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

export {addOrder}