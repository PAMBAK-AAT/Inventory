 


import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({success: false, message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({success: false, message: "Invalid credentials"});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '72h'});

        return res.status(200).json({success: true, message: "login successfully", token, user: {id: user._id, name: user.name, email: user.email, role: user.role}});
    }catch(error){
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}


// --- REGISTER FUNCTION (New) ---
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all fields" });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email is already in use" });
        }

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create a new user
        // Assumes your User model has a 'username' field, as sent by your SignUp.jsx
        const newUser = new User({
            name, // or 'name: username' if your model field is 'name'
            email,
            password: hashedPassword,
            // 'role' will default to 'customer' if you set it in your User model schema
        });

        // 5. Save the user to the database
        await newUser.save();

        // 6. Send success response
        return res.status(201).json({ 
            success: true, 
            message: "User registered successfully. Please log in." 
        });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// Export both functions
export { login, register };



