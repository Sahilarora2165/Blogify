import { useState } from "react";
import { useNavigate , Link} from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/auth/signup", {
                username,
                email,
                password,
            });
            
            console.log("Signup success:", response.data);
            
            // Show aesthetic success toast
            toast.success("Signed up successfully!", {
                duration: 3000, // 3 seconds
                position: 'top-center',
                style: {
                    background: '#ffffff',
                    color: '#2d3748',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                },
                iconTheme: {
                    primary: 'black', // Subtle gray icon
                    secondary: '#ffffff',
                },
            });
            
            setTimeout(() => navigate("/login"), 1000); // Redirect to login page
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
            // Show error toast
            toast.error(err.response?.data?.message || "Signup failed", {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#fef2f2',
                    color: '#9b2c2c',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #fed7d7',
                },
            });
            console.error("Signup error:", err);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('/4.avif')`,
                    filter: 'blur(8px)',
                    WebkitFilter: 'blur(8px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    backgroundBlendMode: 'overlay',
                }}
            ></div>

            <div className="relative z-10 bg-white p-10 rounded-xl shadow-lg w-[28rem] transform transition-all hover:shadow-xl bg-opacity-90 animate-fadeIn">
                <h2 className="text-3xl font-semibold text-center mb-2 text-gray-800 tracking-wide">
                    Create an Account
                </h2>
                <p className="text-center text-gray-500 text-sm mb-6">
                    Join us and start your journey!
                </p>

                {error && <p className="text-red-400 text-center mb-4 font-light">{error}</p>}

                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-shadow shadow-sm"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-shadow shadow-sm"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4 relative">
                        <label className="block text-gray-600 text-sm font-medium mb-2">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-shadow shadow-sm"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-6 relative">
                        <label className="block text-gray-600 text-sm font-medium mb-2">Confirm Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-shadow shadow-sm"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-12 text-gray-500 text-sm font-light hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-gray-800 to-black text-white py-3 rounded-lg hover:from-gray-900 hover:to-gray-800 transition-all shadow-md hover:shadow-lg"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="text-center text-gray-600 text-sm mt-4">
                Already have an account?{' '}
                    <Link to="/login" className="text-gray-800 font-medium hover:text-gray-600 transition-colors duration-200"> Login </Link>
                </p>
            </div>
            {/* Add Toaster component for toast notifications */}
            <Toaster />
        </div>
    );
};

export default Signup;