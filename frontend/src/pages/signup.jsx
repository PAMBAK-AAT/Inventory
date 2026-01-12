

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiUserPlus, FiUser, FiLock, FiMail, FiArrowLeft } from 'react-icons/fi'; // Added FiMail and FiUserPlus

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Assumed API endpoint for registration
            const res = await axios.post('http://localhost:3000/api/auth/register', {
                username,
                email,
                password,
            });

            if (res.data.success) {
                // Success! Navigate to the login page for them to sign in.
                navigate('/login');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message); // "Email already in use" etc.
            } else {
                setError('Sign up failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // Use the same animated gradient background
        <div className="min-h-screen flex items-center justify-center animated-gradient p-4">
            
            {/* Glassmorphism Card Effect */}
            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/30 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Create Account
                </h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                            <FiUser />
                        </span>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-10 px-4 py-3 bg-white/80 border border-slate-300 rounded-lg focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                            required
                        />
                    </div>

                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                            <FiMail />
                        </span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 px-4 py-3 bg-white/80 border border-slate-300 rounded-lg focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                            required
                        />
                    </div>
                    
                    <div className="relative">
                         <span className="absolute left-3 top-3 text-gray-400">
                            <FiLock />
                        </span>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 px-4 py-3 bg-white/80 border border-slate-300 rounded-lg focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40 cursor-pointer disabled:bg-gray-400 disabled:shadow-none disabled:scale-100 flex items-center justify-center"
                    >
                        {loading ? (
                            <FiSpinner className="animate-spin mr-2" /> // Using FiSpinner
                        ) : (
                            <FiUserPlus className="mr-2" />
                        )}
                        {loading ? 'Creating...' : 'Sign Up'}
                    </button>
                </form>
                
                <p className="text-center text-gray-700 text-sm mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-purple-600 font-semibold hover:underline">
                        Log In
                    </Link>
                </p>

                <div className="text-center mt-4">
                    <Link to="/" className="text-sm text-gray-600 hover:text-black inline-flex items-center">
                        <FiArrowLeft className="mr-1" /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;