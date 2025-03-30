import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, User, PenTool } from "lucide-react";
import { useState, useEffect } from "react";

const HomeHeader = ({ onSearch }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSignUp = () => navigate("/signup");
  const handleLogIn = () => navigate("/login");
  const handleProfile = () => navigate("/profile");
  const handleLogOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full bg-gradient-to-r from-white to-gray-50 bg-opacity-95 backdrop-blur-md border-b border-gray-200 shadow-lg z-50"
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Stylish Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <Link
            to="/"
            className="text-4xl font-playfair font-bold text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent hover:text-gray-800 transition-colors duration-300"
          >
            Blogify
          </Link>
        </motion.div>

        {/* Modern Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="relative flex items-center bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Search className="w-5 h-5 text-gray-600" />
          <input
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-64 pl-3 pr-4 text-sm font-cormorant bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-500 text-gray-800 tracking-wide"
          />
        </motion.div>

        {/* Auth / Profile Section */}
        <div className="flex items-center space-x-8">
          {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/write")}
              className="flex items-center bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl hover:from-gray-800 hover:to-gray-600 transition-all duration-300 font-cormorant text-sm font-medium tracking-wide"
            >
              <PenTool className="w-4 h-4 mr-2" />
              Write
            </motion.button>
          )}
          {!isAuthenticated ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignUp}
                className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl hover:from-gray-800 hover:to-gray-600 transition-all duration-300 font-playfair text-sm font-semibold tracking-wide"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogIn}
                className="bg-gradient-to-r from-gray-50 to-gray-200 text-gray-800 px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:from-gray-100 hover:to-gray-300 transition-all duration-300 font-cormorant text-sm font-medium tracking-wide"
              >
                Log In
              </motion.button>
            </>
          ) : (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-300 font-cormorant text-sm font-medium tracking-wide"
              >
                <User className="w-5 h-5 text-gray-600 mr-2" />
                <span>Account</span>
              </motion.button>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-2xl py-3 border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={handleProfile}
                    className="block w-full text-left px-4 py-2 text-gray-700 font-cormorant text-sm tracking-wide hover:bg-gray-50 transition-colors duration-200"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogOut}
                    className="block w-full text-left px-4 py-2 text-gray-700 font-cormorant text-sm tracking-wide hover:bg-gray-50 transition-colors duration-200"
                  >
                    Log Out
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default HomeHeader;