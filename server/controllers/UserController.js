

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


export {addUser, getUsers, deleteUser};
