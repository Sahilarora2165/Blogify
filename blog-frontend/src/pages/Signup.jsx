import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

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
      toast.error("Passwords do not match", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#fef2f2",
          color: "#9b2c2c",
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #fed7d7",
        },
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/signup", {
        username,
        email,
        password,
      });

      console.log("Signup success:", response.data);

      toast.success("Signed up successfully!", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#ffffff",
          color: "#2d3748",
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0",
        },
        iconTheme: {
          primary: "black",
          secondary: "#ffffff",
        },
      });

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Signup failed";
      setError(errorMsg);
      toast.error(errorMsg, {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#fef2f2",
          color: "#9b2c2c",
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #fed7d7",
        },
      });
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black font-sans">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('/4.avif')`,
          filter: "blur(8px) grayscale(100%)",
        }}
      ></div>

      {/* Signup Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200"
      >
        <h2 className="text-4xl font-bold text-center text-black mb-2 tracking-tight uppercase">
          Sign Up
        </h2>
        <p className="text-center text-gray-600 text-sm mb-8 font-light tracking-wide">
          Create your account
        </p>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 text-center mb-6 text-sm font-medium bg-red-100 py-2 rounded-lg border border-red-200"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-black text-sm font-medium mb-2 uppercase tracking-wider"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-3 text-black bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 placeholder-gray-500"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-black text-sm font-medium mb-2 uppercase tracking-wider"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 text-black bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 placeholder-gray-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-black text-sm font-medium mb-2 uppercase tracking-wider"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 text-black bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 placeholder-gray-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-black text-sm font-medium mb-2 uppercase tracking-wider"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 text-black bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 placeholder-gray-500"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} // Fixed: Updates confirmPassword state
              required
            />
            <button
              type="button"
              className="absolute right-3 top-11 text-gray-600 text-sm font-medium hover:text-black transition-colors duration-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 text-white font-medium rounded-lg shadow-md transition-all duration-300 uppercase tracking-wider bg-black hover:bg-gray-800"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6 font-light">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-black font-medium hover:underline transition-all duration-200"
          >
            Sign In
          </Link>
        </p>
      </motion.div>

      <Toaster />
    </div>
  );
};

export default Signup;