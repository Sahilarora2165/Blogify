import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      navigate("/login");
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(response.data);
        setError("");
      } catch (err) {
        let errorMessage = "Failed to load post";
        if (err.response) {
          errorMessage = `Error: ${err.response.status} - ${err.response.data.message || "Unauthorized or server error"}`;
          if (err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            errorMessage = "Session expired. Please log in again.";
          }
        } else if (err.request) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = `Unexpected error: ${err.message}`;
        }
        setError(errorMessage);
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <div className="loading loading-spinner loading-lg text-gray-600"></div>
          <p className="text-gray-600 mt-3 font-cormorant text-lg tracking-wide">Loading post details...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 text-center"
        >
          <p className="text-red-500 mb-4 font-cormorant text-lg tracking-wide">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchPost()}
            className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 font-cormorant text-sm font-medium tracking-wide"
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col p-8">
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-playfair font-bold text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
        >
          Post Details
        </motion.h1>
      </div>

      <div className="flex-1 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 max-w-3xl w-full"
        >
          <div className="space-y-8 max-h-[60vh] overflow-y-auto"> {/* Added max-height and overflow-y */}
            <div>
              <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-4 tracking-tight">{post.title}</h3>
              {post.imageUrl && (
                <div className="mb-6">
                  <img
                    src={`http://localhost:8080${post.imageUrl}`}
                    alt={post.title}
                    className="max-w-full h-64 object-cover rounded-xl shadow-md"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=No+Image+Available";
                      console.error("Image load error:", e);
                    }}
                  />
                </div>
              )}
              <p className="text-gray-700 font-cormorant text-base leading-relaxed tracking-wide whitespace-pre-wrap break-words"> {/* Added whitespace and break-words */}
                {post.content || "No content available"}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-playfair font-semibold text-gray-900 mb-3 tracking-tight">
                Author Information
              </h4>
              <p className="text-gray-600 font-cormorant text-sm tracking-wide">
                Name: {post.username || "Anonymous"}
              </p>
              <p className="text-gray-600 font-cormorant text-sm tracking-wide">
                Email: {post.email || "Not provided"}
              </p>
              <p className="text-gray-500 font-cormorant text-xs mt-2 tracking-wide">
                Created: {new Date(post.createdAt).toLocaleString()}
              </p>
              {post.updatedAt && (
                <p className="text-gray-500 font-cormorant text-xs mt-1 tracking-wide">
                  Updated: {new Date(post.updatedAt).toLocaleString()}
                </p>
              )}
              <p className="text-gray-500 font-cormorant text-xs mt-1 tracking-wide">
                Status: {post.deleted ? "Deleted" : "Active"}
              </p>
            </div>
          </div>
          <div className="mt-8 flex space-x-4 justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
              className="px-6 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-full shadow-lg hover:shadow-xl hover:from-gray-800 hover:to-gray-600 transition-all duration-300 font-cormorant text-sm font-medium tracking-wide"
            >
              Edit Post
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/posts")}
              className="px-6 py-2 bg-gradient-to-r from-gray-50 to-gray-200 text-gray-800 rounded-full shadow-md hover:shadow-lg hover:from-gray-100 hover:to-gray-300 transition-all duration-300 font-cormorant text-sm font-medium tracking-wide"
            >
              Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PostDetail;