import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
            <span className="text-gray-900">About</span>
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
            About Blogify
          </h1>
          
          {/* Introduction */}
          <p className="text-lg font-cormorant text-gray-600 leading-relaxed mb-6">
            Blogify is more than just a blogging platform—it’s a canvas for the human experience. Founded on the belief that every story matters, we’ve created a space where words weave connections, spark inspiration, and echo across borders. From quiet reflections to bold manifestos, Blogify is where your voice finds its home.
          </p>

          {/* Our Vision */}
          <div className="mb-8">
            <h2 className="text-2xl font-playfair font-semibold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-lg font-cormorant text-gray-600 leading-relaxed">
              We envision a world where storytelling transcends barriers—cultural, linguistic, and personal. Blogify aims to empower creators by offering tools that are intuitive yet powerful, fostering a digital haven where ideas flourish. Our goal is to amplify diverse voices and build a tapestry of narratives that reflect the beauty and complexity of life.
            </p>
          </div>

          {/* The Community */}
          <div className="mb-8">
            <h2 className="text-2xl font-playfair font-semibold text-gray-900 mb-4">The Community</h2>
            <p className="text-lg font-cormorant text-gray-600 leading-relaxed">
              At the heart of Blogify lies its community—a vibrant collective of writers, readers, and dreamers. Whether you’re a seasoned author or penning your first post, you’re part of something bigger. Our platform thrives on interaction: comments, shares, and collaborations that turn solitary words into shared experiences. Together, we’re crafting a legacy of stories that endure.
            </p>
          </div>

          {/* Call to Action */}
          <div className="mb-8">
            <h2 className="text-2xl font-playfair font-semibold text-gray-900 mb-4">Join the Journey</h2>
            <p className="text-lg font-cormorant text-gray-600 leading-relaxed">
              Blogify isn’t just a destination; it’s a beginning. We invite you to explore, create, and connect. Share your triumphs, your struggles, your quiet moments—because every story deserves to be told. Ready to leave your mark? Dive in and let your words ripple through the world.
            </p>
          </div>

          {/* Enhanced Start Writing Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center"
          >
            <button
              onClick={() => navigate("/write")}
              className="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-full shadow-lg hover:shadow-xl hover:from-gray-800 hover:to-gray-600 transition-all duration-300 font-playfair text-lg font-semibold tracking-wide"
            >
              Start Writing Now
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;