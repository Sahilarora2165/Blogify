import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import HomeHeader from "../components/HomeHeader";
import { motion } from "framer-motion";

const ProfileContent = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch user by username
        console.log(`Fetching user profile for username: ${username}`);
        const userResponse = await axios.get(`http://localhost:8080/api/users/username/${username}`, {
          timeout: 5000,
        });
        console.log("User response:", userResponse.data);
        if (!userResponse.data || !userResponse.data.id) {
          throw new Error("User data is invalid or missing ID");
        }
        setUser(userResponse.data);

        // Fetch user's posts by user ID
        const userId = userResponse.data.id;
        console.log(`Fetching posts for userId: ${userId}`);
        const postsResponse = await axios.get(`http://localhost:8080/api/posts/user/${userId}`, {
          timeout: 5000,
        });
        console.log("Posts response:", postsResponse.data);
        setPosts(postsResponse.data || []);
      } catch (err) {
        const errorDetails = {
          message: err.message,
          code: err.code,
          status: err.response ? err.response.status : "No status",
          data: err.response ? err.response.data : "No response data",
        };
        console.error("Error fetching profile or posts:", errorDetails);
        if (err.code === "ERR_NETWORK") {
          setError("Cannot connect to the server. Please check if it's running.");
        } else if (err.response?.status === 404) {
          setError(`User '${username}' or their posts not found.`);
        } else if (err.response?.status === 403) {
          setError("Access denied. Please log in if required.");
        } else {
          setError(`An unexpected error occurred: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [username]);

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
          <p className="text-gray-600 mt-3 font-cormorant text-lg tracking-wide">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 text-center"
        >
          <p className="text-red-500 font-cormorant text-lg tracking-wide mb-4">
            {error || "User not found."}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-white text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100 transition-all duration-300 font-cormorant text-sm font-medium tracking-wide"
          >
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <HomeHeader />

      <div className="max-w-4xl mx-auto pt-24 pb-12 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-medium text-gray-600">
              {user.username[0].toUpperCase()}
            </span>
          </div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {user.username}
          </h1>
          {user.email && (
            <p className="text-gray-600 font-cormorant text-sm tracking-wide mt-2">
              {user.email}
            </p>
          )}
          <p className="text-gray-500 font-cormorant text-sm tracking-wide mt-1">
            Joined: {new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-playfair font-semibold text-gray-900 mb-6 tracking-tight">
            Blog Posts ({posts.length})
          </h2>
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  <Link to={`/post/${post.id}`} className="text-gray-900 hover:text-gray-700">
                    <h3 className="text-lg font-playfair font-semibold text-gray-900 mb-2 tracking-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 font-cormorant text-sm line-clamp-2 leading-relaxed tracking-wide">
                      {post.content}
                    </p>
                    <p className="text-gray-500 font-cormorant text-xs mt-2 tracking-wide">
                      Published: {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 font-cormorant text-lg tracking-wide text-center">
              No posts yet.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileContent;