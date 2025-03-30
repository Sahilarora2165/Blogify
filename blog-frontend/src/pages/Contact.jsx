import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-sm font-cormorant font-medium"
          >
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 relative group transition-all duration-300 ease-in-out"
            >
              Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
            </Link>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-900">Contact</span>
          </motion.div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <h1 className="text-4xl font-playfair font-bold text-gray-900 tracking-tight mb-6">
            Contact Us
          </h1>
          <p className="text-lg font-cormorant text-gray-600 leading-relaxed mb-6">
            We’d love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out. Our team is here to support your journey on Blogify.
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-playfair font-semibold text-gray-900 mb-2">Email</h2>
              <p className="text-sm font-cormorant text-gray-600">
                <a href="mailto:support@blogify.com" className="hover:text-gray-900 transition-colors duration-300">
                  support@blogify.com
                </a>
              </p>
            </div>
            <div>
              <h2 className="text-xl font-playfair font-semibold text-gray-900 mb-2">Social</h2>
              <p className="text-sm font-cormorant text-gray-600">
                Follow us on{" "}
                <a href="#" className="hover:text-gray-900 transition-colors duration-300">
                  Twitter
                </a>
                ,{" "}
                <a href="#" className="hover:text-gray-900 transition-colors duration-300">
                  Instagram
                </a>
                , or{" "}
                <a href="#" className="hover:text-gray-900 transition-colors duration-300">
                  LinkedIn
                </a>
                .
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;