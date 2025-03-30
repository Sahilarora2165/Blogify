import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Privacy = () => {
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
            <span className="text-gray-900">Privacy</span>
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
            Privacy Policy
          </h1>
          <p className="text-lg font-cormorant text-gray-600 leading-relaxed mb-6">
            At Blogify, your privacy is our priority. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our platform.
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-playfair font-semibold text-gray-900 mb-2">Information We Collect</h2>
              <p className="text-sm font-cormorant text-gray-600">
                We may collect personal data such as your username, email address, and profile information when you register or interact with Blogify. We also gather usage data to improve your experience.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-playfair font-semibold text-gray-900 mb-2">How We Use Your Data</h2>
              <p className="text-sm font-cormorant text-gray-600">
                Your information is used to personalize your experience, manage your account, and communicate with you. We do not sell your data to third parties.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-playfair font-semibold text-gray-900 mb-2">Your Rights</h2>
              <p className="text-sm font-cormorant text-gray-600">
                You can access, update, or delete your personal information at any time through your profile settings. For further assistance, contact us at{" "}
                <a href="mailto:privacy@blogify.com" className="hover:text-gray-900 transition-colors duration-300">
                  privacy@blogify.com
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

export default Privacy;