import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware functions MUST have (req, res, next)
const authMiddleware = async (req, res, next) => {
    try {
        // Use optional chaining '?' for a safer check
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided, authorization denied." });
        }

        // This will verify the token and return the payload { id: '...' }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // --- THIS IS THE FIX ---
        // We find the user by 'decoded.id' to match how you created the token
        // We also use .select('-password') as a security best practice
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            // 404 is more accurate if the user ID in a valid token doesn't exist
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Attach the user (without password) to the request object
        req.user = user;
        
        // Pass control to the next middleware or route handler
        next();
    
    } catch (error) {
        // This will catch expired tokens or invalid signatures
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({ success: false, message: "Token is not valid or has expired." });
    }
}

export default authMiddleware;

