import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full mt-20 py-8 bg-gradient-to-r from-gray-100 to-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            <h3 className="text-xl font-playfair font-bold text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Blogify
            </h3>
            <p className="text-xs font-cormorant text-gray-600 leading-relaxed">
              Crafting stories, connecting souls since {new Date().getFullYear()}.
            </p>
          </motion.div>

          {/* Navigation Links */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center md:items-start space-y-2"
          >
            {[
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
              { to: "/privacy", label: "Privacy Policy" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-xs font-cormorant font-medium text-gray-700 hover:text-gray-900 relative group transition-all duration-300 ease-in-out"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-900 to-gray-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
              </Link>
            ))}
          </motion.nav>

          {/* Actions & Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center md:items-end space-y-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-200 text-gray-800 rounded-full shadow-md hover:shadow-lg hover:from-gray-100 hover:to-gray-300 transition-all duration-300 font-cormorant text-xs font-medium"
            >
              <ArrowUp size={14} className="text-gray-600" />
              Back to Top
            </motion.button>
            <span className="text-[10px] font-cormorant text-gray-500 tracking-wide">
              © {new Date().getFullYear()} Blogify. All rights reserved.
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;