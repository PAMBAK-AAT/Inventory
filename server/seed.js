
import bcrypt from 'bcrypt'
import User from './models/User.js'
import connectDB from './db/connection.js'

const registerUser = async () => {

    try{
        connectDB();
        const hashedPassword = await bcrypt.hash("admin", 10);
        const newUser = new User({
            name: "admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            address: "admin-address",
            role: "admin"
        })

        await newUser.save();
        console.log("Admin user created successfully");
    }catch(error){
        console.log(error);
    }
}

registerUser();