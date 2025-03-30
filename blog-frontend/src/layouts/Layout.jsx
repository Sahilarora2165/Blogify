import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useEffect } from "react";

const Layout = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Main Container with Sidebar and Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -64 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="hidden md:block w-64 h-screen bg-white shadow-lg border-r border-gray-200"
        >
          <Sidebar />
        </motion.div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-12">
          <Outlet />
        </main>
      </div>

      {/* Footer - Always at Bottom */}
      <Footer />
    </div>
  );
};

export default Layout;
