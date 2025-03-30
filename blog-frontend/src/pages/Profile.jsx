import { useEffect, useState } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [statistics, setStatistics] = useState({ postCount: 0, commentCount: 0 });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    profilePicture: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchUserPosts();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("/users/me");
      if (response.status === 200) {
        setUser(response.data);
        setFormData({
          username: response.data.username,
          bio: response.data.bio,
          profilePicture: null,
        });
        fetchUserStatistics(response.data.id);
      } else {
        setError("Failed to fetch user details");
      }
      setLoading(false);
    } catch (error) {
      setError("You are not logged in. Redirecting to login...");
      navigate("/login");
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await api.get("/users/me/posts");
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError("Failed to fetch user posts");
    }
  };

  const fetchUserStatistics = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/statistics`);
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching user statistics:", error);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEditProfile = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("bio", formData.bio);

      if (formData.profilePicture) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }

      const response = await api.put(`/users/me`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(response.data);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleEditPost = (postId) => {
    navigate(`/update/${postId}`);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/posts/${postId}`);
        fetchUserPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-black"></div>
          <p className="text-gray-600 mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      {error ? (
        <div className="bg-white p-6 rounded-lg shadow-md backdrop-blur-sm bg-opacity-80">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-sm font-medium"
            >
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-black relative group transition-all duration-300 ease-in-out"
              >
                Home
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
              </button>
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-black">Profile</span>
            </motion.div>
          </div>

          {/* Header Section */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            </div>
            <button
              onClick={logoutUser}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm"
            >
              Logout
            </button>
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-md backdrop-blur-sm bg-opacity-80 p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0">
                <img
                  src={user?.profilePicture || "/default-avatar.png"}
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-full shadow-lg"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold text-gray-900">{user?.username || "No username available"}</h2>
                    <p className="text-gray-500">{user?.email || "No email available"}</p>
                    <div className="mt-3">
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-700">About Me:</span> {user?.bio || "No bio available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* User Statistics */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md backdrop-blur-sm bg-opacity-80">
                <p className="text-2xl font-bold text-gray-900">{statistics.postCount}</p>
                <p className="text-gray-500">Posts</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md backdrop-blur-sm bg-opacity-80">
                <p className="text-2xl font-bold text-gray-900">{statistics.commentCount}</p>
                <p className="text-gray-500">Comments</p>
              </div>
            </div>
          </div>

          {/* User's Blog Posts */}
          <div className="bg-white rounded-lg shadow-md backdrop-blur-sm bg-opacity-80 overflow-hidden">
            <div className="px-6 pt-6 pb-4 flex justify-between items-center border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Your Blog Posts</h3>
              <button
                onClick={() => navigate('/write')}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm"
              >
                New Post
              </button>
            </div>

            <div className="p-6">
              {Array.isArray(posts) && posts.length > 0 ? (
                <div className="grid gap-6">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white p-5 rounded-lg shadow-md backdrop-blur-sm bg-opacity-80 hover:shadow-lg transition-all duration-200 cursor-pointer"
                      onClick={() => handlePostClick(post.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1 mb-4 md:mb-0">
                          <h3 className="text-lg font-semibold text-gray-900">{post.title || "Untitled"}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                            {post.content || "No content available"}
                          </p>
                          <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                            <span>Created: {new Date(post.createdAt).toLocaleString()}</span>
                            {post.updatedAt && (
                              <span>Updated: {new Date(post.updatedAt).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPost(post.id);
                            }}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePost(post.id);
                            }}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 shadow-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md backdrop-blur-sm bg-opacity-80">
                  <p className="text-gray-600 mb-4">No blog posts yet.</p>
                  <button
                    onClick={() => navigate('/posts/new')}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm"
                  >
                    Create Your First Post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Edit Profile Modal */}
      {editMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        >
          <div className="bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-xl w-full max-w-md p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-playfair font-bold text-gray-900 tracking-tight">Edit Profile</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setEditMode(false)}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
              >
                ×
              </motion.button>
            </div>
            <div className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-cormorant font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-3 bg-transparent border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-800 font-cormorant text-sm tracking-wide"
                  placeholder="Your username"
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-cormorant font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-3 bg-transparent border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-800 font-cormorant text-sm tracking-wide resize-none h-32"
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              </div>
              <div>
                <label htmlFor="profilePicture" className="block text-sm font-cormorant font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  onChange={(e) => setFormData({ ...formData, profilePicture: e.target.files[0] })}
                  className="w-full p-2.5 bg-transparent border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-800 font-cormorant text-sm tracking-wide file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-gray-100 file:text-gray-700 file:hover:bg-gray-200 file:transition-all file:duration-300"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditMode(false)}
                className="px-6 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full shadow-md hover:shadow-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-300 font-cormorant text-sm font-medium tracking-wide"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditProfile}
                className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-full shadow-lg hover:shadow-xl hover:from-gray-800 hover:to-gray-600 transition-all duration-300 font-playfair text-sm font-semibold tracking-wide"
              >
                Save Changes
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;