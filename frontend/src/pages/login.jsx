


import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiLogIn, FiUser, FiLock } from 'react-icons/fi'; // Using react-icons

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        try {
            // Make the API call to your backend
            // Note: You should move 'http://localhost:3000' to a .env file later
            const res = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password,
            });

            // Use the login function from your AuthContext
            if (res.data.success) {
                login(res.data.user, res.data.token);
                // Navigate to the root, Root.jsx will handle redirection
                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message); // "User not found" or "Invalid credentials"
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Inventory Login
                </h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                            <FiUser />
                        </span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div className="mb-6 relative">
                         <span className="absolute left-3 top-3 text-gray-400">
                            <FiLock />
                        </span>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                    >
                        <FiLogIn className="mr-2" />
                        Login
                    </button>
                </form>
                
                <p className="text-center text-gray-500 text-sm mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;