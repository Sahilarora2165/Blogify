import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BlogCard = ({ title, author, date, description }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gray-900 p-6 rounded-lg shadow-2xl border border-gray-950"
    >
      <h2 className="text-white text-2xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-400 text-sm mb-4">By {post.author}</p>
      <p className="text-gray-300 mb-4">{post.description.substring(0, 100)}...</p>
      <Link 
        to={`/post/${post.id}`} 
        className="text-blue-400 hover:underline"
      >
        Read More
      </Link>
    </motion.div>
  );
};

export default BlogCard;
