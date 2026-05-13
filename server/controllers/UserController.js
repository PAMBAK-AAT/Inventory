

import User from "../models/User.js";
import bcrypt from "bcryptjs";


const addUser = async (req, res) => {
    try{
        const {name, email, password, address, role} = req.body;

        // Validation
        if(!name || !email || !password || !role){
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }

        // Check existing user
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            address,
            role,
        });


        return res.status(201).json({
            success: true,
            message: "User added successfully",
        });
    }catch(error){
        console.error("Add User Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while adding user",
        });
    }
};

const getUsers = async (req, res) => {
    try{
        const users = await User.find().select("-password"); // hide password
        return res.status(200).json({
            success: true,
            users,
        });
    }catch (error){
        console.error("Get Users error: ", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching users",
        });
    }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    });
  }
};

const getUser = async (req, res) => {
    try{
        const user = req.user;
        if(!user){
            // Fixed typo: 'seccess' to 'success'
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        return res.status(200).json({ success: true, user });
    }catch(error){
        console.error("Get User Error:", error);
        return res.status(500).json({success: false, message: "Server error while fetching user"});
    }
}


const updateUser = async (req, res) => {
    try{
        const { name, email, address, password } = req.body;
        const userId = req.user._id; // Safely get ID from the authenticated token

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update basic fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (address) user.address = address;

        // If user typed a new password, hash it and update
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                address: user.address, 
                role: user.role 
            }
        });
    }catch(error){
        console.error("Update User Error:", error);
        return res.status(500).json({ success: false, message: "Server error while updating profile" });
    }
}

export {addUser, getUsers, deleteUser, getUser, updateUser};
